// Load the express module
const express = require("express");

// Initialize the router
const router = express.Router();

// Export a function that takes an express app and adds routes to it
module.exports = function (app, userCollection, bcrypt, saltRounds) {
  // Set up a GET route for the user profile page
  app.get("/userProfile", async (req, res) => {
    // If the user is authenticated,
    if (req.session.authenticated) {
      // Get the email of the user from the session
      const email = req.session.email;

      // Find the user in the database using their email
      const user = await userCollection.findOne({ email: email });

      // If no user is found, redirect to login page
      if (!user) {
        res.redirect("/login");
        return;
      }

      // Render the user profile page with the found user data
      res.render("userProfile", { user });
    } else {
      // If the user is not authenticated, redirect to the root URL
      res.redirect("/");
      return;
    }
  });

  // Set up a POST route for the user profile page
  app.post("/userProfile", async (req, res) => {
    // If the user is authenticated,
    if (req.session.authenticated) {
      // Extract form inputs
      const email = req.session.email;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const username = req.body.username;
      const newEmail = req.body.email;
      const password = req.body.password;
      const skills = req.body.skills;
      const personality = req.body.personality;

      // Set update fields for the user document
      const updateFields = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: newEmail,
        skills: skills,
        personality: personality,
      };

      // If the password field is not empty, hash the new password
      if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
      }

      // Update the user document in the database
      await userCollection.updateOne({ email: email }, { $set: updateFields });

      // If the email has changed, update the email in the session
      if (email !== newEmail) {
        req.session.email = newEmail;
      }

      // Redirect to the user profile page
      res.redirect("/userProfile");
    } else {
      // If the user is not authenticated, redirect to the signup page
      res.redirect("/signup");
      return;
    }
  });
};
