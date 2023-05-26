const express = require("express");
const router = express.Router();
module.exports = function (app) {
  app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
  });
}