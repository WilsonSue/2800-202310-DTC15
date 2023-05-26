// Load the express module
const express = require("express");

// Initialize the router
const router = express.Router();

// Export a function that takes an express app and adds routes to it
module.exports = function (app, userCollection, bcrypt, Joi, expireTime) {
  // Define a middleware function to redirect authenticated users to the profile page
  function redirectToProfileIfAuthenticated(req, res, next) {
    if (req.session.authenticated) {
      res.redirect("/userProfile");
    } else {
      next();
    }
  }

  // Set up a GET route for the login page
  app.get("/login", redirectToProfileIfAuthenticated, (req, res) => {
    // Render the "login" view with no initial error message
    res.render("login", { errorMessage: null });
  });

  // Set up a POST route for form submission on the login page
  app.post("/loginSubmit", async (req, res) => {
    // Trim leading and trailing whitespace from the entered password and email
    var password = req.body.password.trim();
    var email = req.body.email.trim();

    // Set up schema validation for email
    const schema = Joi.string().email().required();
    // Validate the email
    const validationResult = schema.validate(email);

    let errorMessage = null;

    // Check if validation failed
    if (validationResult.error != null) {
      // Set error message if email format is invalid
      errorMessage = "Invalid email format.";
    } else {
      // Query the user collection for the entered email
      const result = await userCollection
        .find({ email: email })
        .project({ email: 1, password: 1, username: 1, _id: 1, role: 1 })
        .toArray();

      // Check if user not found or multiple users found
      if (result.length != 1) {
        errorMessage = "User not found.";
      } else {
        // Compare entered password with stored password
        if (await bcrypt.compare(password, result[0].password)) {
          // Set session variables if password is correct
          req.session.authenticated = true;
          req.session.userId = result._id;
          req.session.username = result[0].username;
          req.session.email = result[0].email;
          req.session.cookie.maxAge = expireTime;
          // Redirect to search page
          res.redirect("/search");
          return;
        } else {
          // Set error message if password is incorrect
          errorMessage = "Invalid email/password combination.";
        }
      }
    }

    // Render the "login" view with the error message
    res.render("login", { errorMessage: errorMessage });
  });
};
