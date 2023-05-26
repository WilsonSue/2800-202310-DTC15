// Load the express module
const express = require("express");

// Initialize the router
const router = express.Router();

// Export a function that takes an express app and adds routes to it
module.exports = function (app) {
  // Set up a wildcard GET route for any route ("*") that hasn't been defined earlier
  app.get("*", (req, res) => {
    // Set HTTP response status code to 404 (Not Found)
    res.status(404);

    // Render the "404" view
    res.render("404");
  });
};
