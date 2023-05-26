const express = require("express");
const router = express.Router();
module.exports = function (app, userCollection, bcrypt, saltRounds) {
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
      console.log(skills);
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
}