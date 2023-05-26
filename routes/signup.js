const express = require("express");
const router = express.Router();

module.exports = function (app, userCollection, bcrypt, Joi, saltRounds, expireTime) {
  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/submitUser", async (req, res) => {
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var email = req.body.email.trim();
    const schema = Joi.object({
      username: Joi.string().alphanum().max(20).required(),
      password: Joi.string().min(6).max(16).required(),
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
      username: username,
      password: hashedPassword,
      email: email,
      skills: "",
      personality: "",
    });
    req.session.authenticated = true;
    req.session.username = username;
    req.session.email = email; // Add this line to store the email in the session
    req.session.cookie.maxAge = expireTime;
    console.log("Inserted user");
    res.redirect("/search"); // Change this line to redirect to userProfile instead of /members
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
}