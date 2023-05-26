const express = require("express");
const router = express.Router();
module.exports = function (app) {
  app.get("/", (req, res) => {
    const authenticated = req.session.authenticated;
    const username = req.session.username;
    res.render("index", { authenticated, username });
  });
}