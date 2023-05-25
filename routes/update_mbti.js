const express = require("express");
const router = express.Router();
const { updateDocumentsWithMbti } = require("../MBTI_sort/mbtiAssignment.js");
router.get("/update-mbti", (req, res) => {
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