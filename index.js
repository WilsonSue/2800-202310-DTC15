require("./utils.js");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const Joi = require("joi");
const app = express();
const expireTime = 60 * 60 * 1000;
const saltRounds = 12;
const port = process.env.PORT || 4000;

app.set("view engine", "ejs");

const mongodb_host = process.env.MONGODB_HOST;
const atlas_db_user = process.env.ATLAS_DB_USER;
const atlas_db_password = process.env.ATLAS_DB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var { database } = include("databaseConnection");
const userCollection = database.db(mongodb_database).collection("users");
const jobCollection = database
  .db(mongodb_database)
  .collection("glassdoor_jobs");

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${atlas_db_user}:${atlas_db_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
);

const resetPasswordRouter = require("./resetPassword.js");
app.use(resetPasswordRouter);

app.get("/", (req, res) => {
  const authenticated = req.session.authenticated;
  const username = req.session.username;
  res.render("index", { authenticated, username });
});

app.use(express.static(__dirname + "/public"));

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/submitUser", async (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  const schema = Joi.object({
    firstName: Joi.string().alphanum().max(20).required(),
    lastName: Joi.string().alphanum().max(20).required(),
    username: Joi.string().alphanum().max(20).required(),
    password: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
  });
  if (!email) {
    res.redirect("/signupSubmit?missing=1");
    return;
  }
  if (!username) {
    res.redirect("/signupSubmit?missing=2");
    return;
  }
  if (!password) {
    res.redirect("/signupSubmit?missing=3");
    return;
  }
  const validationResult = schema.validate({ username, password, email });
  if (validationResult.error != null) {
    console.log(validationResult.error);
    res.redirect("/signup");
    return;
  }
  var hashedPassword = await bcrypt.hash(password, saltRounds);
  await userCollection.insertOne({
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: hashedPassword,
    email: email,
    skills: "",
    personality: "",
  });
  req.session.authenticated = true;
  req.session.username = username;
  req.session.email = email; // Add this line to store the email in the session
  console.log("Inserted user");
  res.redirect("/userProfile"); // Change this line to redirect to userProfile instead of /members
});

app.get("/signupSubmit", (req, res) => {
  const missingInput = req.query.missing;
  const errorMessages = {
    1: "Email is required",
    2: "Username is required",
    3: "Password is required",
  };

  res.render("signupSubmit", { missingInput, errorMessages });
});

function redirectToProfileIfAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    res.redirect("/userProfile");
  } else {
    next();
  }
}

app.get("/login", redirectToProfileIfAuthenticated, (req, res) => {
  res.render("login", { errorMessage: null });
});

app.post("/login", async (req, res) => {
  let errorMessage = null;

  try {
    const result = await usersModel.findOne({
      username: req.body.username,
    });

    if (bcrypt.compareSync(req.body.password, result.password)) {
      req.session.GLOBAL_AUTHENTICATED = true;
      req.session.loggedUsername = req.body.username;
      req.session.loggedPassword = req.body.password;
      res.redirect("/");
      return;
    } else {
      errorMessage = "Invalid password.";
    }
  } catch (error) {
    console.log(error);
    errorMessage = "An error occurred.";
  }

  res.render("loginSubmit", { errorMessage: errorMessage });
});

app.post("/loginSubmit", async (req, res) => {
  var password = req.body.password;
  var email = req.body.email;
  const schema = Joi.string().email().required();
  const validationResult = schema.validate(email);
  let errorMessage = null;

  if (validationResult.error != null) {
    errorMessage = "Invalid email format.";
  } else {
    const result = await userCollection
      .find({ email: email })
      .project({ email: 1, password: 1, username: 1, _id: 1, role: 1 })
      .toArray();

    if (result.length != 1) {
      errorMessage = "User not found.";
    } else {
      if (await bcrypt.compare(password, result[0].password)) {
        req.session.authenticated = true;
        req.session.username = result[0].username;
        req.session.email = result[0].email;
        req.session.cookie.maxAge = expireTime;
        res.redirect("/userProfile");
        return;
      } else {
        errorMessage = "Invalid email/password combination.";
      }
    }
  }

  res.render("login", { errorMessage: errorMessage });
});

app.get("/userProfile", async (req, res) => {
  if (req.session.authenticated) {
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      res.redirect("/login");
      return;
    }

    res.render("userProfile", { user });
  } else {
    res.redirect("/");
    return;
  }
});

app.post("/userProfile", async (req, res) => {
  if (req.session.authenticated) {
    const email = req.session.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const newEmail = req.body.email;
    const password = req.body.password;
    const skills = req.body.skills;
    const personality = req.body.personality;

    const updateFields = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: newEmail,
      skills: skills,
      personality: personality,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    }

    await userCollection.updateOne({ email: email }, { $set: updateFields });

    // Update session email if it changed
    if (email !== newEmail) {
      req.session.email = newEmail;
    }

    res.redirect("/userProfile");
  } else {
    res.redirect("/signup");
    return;
  }
});

app.get("/search", async (req, res) => {
  res.render("search");
});

app.post("/search", async (req, res) => {
  // placeholder
});

app.get("/explore", async (req, res) => {
  const listings = await jobCollection.find({}).toArray();
  res.render("explore", { listings });
});

app.post("/explore", async (req, res) => {
  // placeholder
});

app.get("/savedListings", async (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
    return;
  }
  // const listings = await jobCollection.find({}).toArray();
  res.render("savedListings");
});

app.post("/savedListings", async (req, res) => {
  // placeholder
});

app.get("/populatedListings", async (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
    return;
  }
  const listings = await jobCollection.find({}).toArray();
  res.render("populatedListings", { listings });
});

app.post("/populatedListings", async (req, res) => {
  // placeholder
});

app.get("/filter", async (req, res) => {
  res.render("filter");
});

app.post("/filter", async (req, res) => {
  // placeholder
});

app.get("/logout", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
    return;
  }
  req.session.destroy();
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404);
  res.render("404");
});

app.listen(port, () => {
  console.log("Node application listening on port" + port);
});

module.exports = app;
