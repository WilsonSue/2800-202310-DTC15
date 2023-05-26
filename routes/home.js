// Load the express module
const express = require("express");

// Initialize the router
const router = express.Router();

// Export a function that takes an express app and adds routes to it
module.exports = function (app) {
  // Set up a GET route for the root ("/") path of the app
  app.get("/", (req, res) => {
    // Check if the user is authenticated by getting it from the session
    // If there's no session data this will be undefined, which is considered "falsy"
    const authenticated = req.session.authenticated;

    // Get the username from the session data
    // If there's no session data this will be undefined
    const username = req.session.username;

    // Render the "index" view and pass in the authentication status and username
    // If either of these is undefined, they won't appear to the template
    res.render("index", { authenticated, username });
  });
};
