// Import the express module and create a new router
const express = require("express");
const router = express.Router();

// Export a function which takes various dependencies
module.exports = function (
  app,
  userCollection,
  bcrypt,
  Joi,
  saltRounds,
  expireTime
) {
  // GET route for the sign-up page
  app.get("/signup", (req, res) => {
    // Render the sign-up view
    res.render("signup");
  });

  // POST route for user sign-up submission
  app.post("/submitUser", async (req, res) => {
    // Trim input values from request body
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var email = req.body.email.trim();

    // Define validation schema for username, password, and email
    const schema = Joi.object({
      username: Joi.string().alphanum().max(20).required(),
      password: Joi.string().min(6).max(16).required(),
      email: Joi.string().email().required(),
    });

    // Check if fields are missing and redirect with corresponding error code
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

    // Validate the input against the schema
    const validationResult = schema.validate({ username, password, email });
    if (validationResult.error != null) {
      console.log(validationResult.error);
      // If validation fails, redirect to the sign-up page
      res.redirect("/signup");
      return;
    }

    // Hash the password
    var hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the user collection in the database
    await userCollection.insertOne({
      username: username,
      password: hashedPassword,
      email: email,
      skills: "",
      personality: "",
    });

    // Set up session for authenticated user
    req.session.authenticated = true;
    req.session.username = username;
    req.session.email = email;
    req.session.cookie.maxAge = expireTime;

    // Log the success of the user insertion
    console.log("Inserted user");

    // Redirect the user to the search page
    res.redirect("/search");
  });

  // GET route for the sign-up submission page
  app.get("/signupSubmit", (req, res) => {
    // Extract the error code from the request query
    const missingInput = req.query.missing;
    // Define error messages for each error code
    const errorMessages = {
      1: "Email is required",
      2: "Username is required",
      3: "Password is required",
    };

    // Render the sign-up submission page with error message
    res.render("signupSubmit", { missingInput, errorMessages });
  });
};
