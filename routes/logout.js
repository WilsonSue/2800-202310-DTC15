const express = require("express");
const router = express.Router();
router.get("/logout", (req, res) => {
    if (!req.session.authenticated) {
      res.redirect("/login");
      return;
    }
    req.session.destroy();
    res.redirect("/");
  });