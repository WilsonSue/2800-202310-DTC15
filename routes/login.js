const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const expireTime = 60 * 60 * 1000;
function redirectToProfileIfAuthenticated(req, res, next) {
    if (req.session.authenticated) {
      res.redirect("/userProfile");
    } else {
      next();
    }
  }

  router.get("/login", redirectToProfileIfAuthenticated, (req, res) => {
    res.render("login", { errorMessage: null });
  });

  router.post("/loginSubmit", async (req, res) => {
    var password = req.body.password.trim();
    var email = req.body.email.trim();
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
          req.session.userId = result._id;
          req.session.username = result[0].username;
          req.session.email = result[0].email;
          req.session.cookie.maxAge = expireTime;
          res.redirect("/search");
          return;
        } else {
          errorMessage = "Invalid email/password combination.";
        }
      }
    }

    res.render("login", { errorMessage: errorMessage });
  });