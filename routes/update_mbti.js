const express = require("express");
const router = express.Router();

module.exports = function (app, jobCollection, updateDocumentsWithMbti) {
  app.get("/update-mbti", (req, res) => {
    // Call your MongoDB function
    console.log(jobCollection);
    updateDocumentsWithMbti(jobCollection)
      .then(() => {
        res.send("Documents updated with MBTI");
      })
      .catch((error) => {
        res.status(500).send("Error updating documents with MBTI");
      });
  });
}