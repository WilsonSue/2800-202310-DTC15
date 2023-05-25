const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    const authenticated = req.session.authenticated;
    const username = req.session.username;
    res.render("index", { authenticated, username });
  });