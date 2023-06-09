// Load the express module
const express = require("express");
// Initialize the router
const router = express.Router();

// Load the databaseConnection module
module.exports = function (app, fakeJobsCollection) {
  app.get("/easterEgg", async (req, res) => {
    // Fetch all the fake job listings
    const fakeJobs = await fakeJobsCollection.find().toArray();

    // Render the easterEgg view, passing in the fake job listings
    res.render("easterEgg", { fakeJobs });
  });
};
