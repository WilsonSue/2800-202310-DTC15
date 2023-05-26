// Load the express module
const express = require("express");

// Initialize the router
const router = express.Router();

// Export a function that takes an express app and adds routes to it
module.exports = function (app) {
  // Set up a GET route for the logout page
  app.get("/logout", (req, res) => {
    // If the user is not authenticated, redirect them to the login page
    if (!req.session.authenticated) {
      res.redirect("/login");
      return;
    }

    // Destroy the session for the user, effectively logging them out
    req.session.destroy();

    // Redirect the user to the root URL
    res.redirect("/");
  });
};
