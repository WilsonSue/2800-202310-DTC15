const express = require("express");
const router = express.Router();
const { database } = require("../databaseConnection");
require("dotenv").config();

const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

// GET request for savedListings
router.get("/savedListings", async (req, res) => {
  console.log(req.session);
  console.log("User ID in session:", req.session.userId);
  if (!req.session.authenticated) {
    res.redirect("/login");
    return;
  }

  try {
    const user = await userCollection.findOne({ email: req.session.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.render("savedListings");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

// POST request for savedListings
router.post("/savedListings", async (req, res) => {
  console.log("POST request received at /savedListings");
  console.log("req.body:", req.body);
  if (!req.session.authenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized: YOU SHALL NOT PASS" });
  }
  try {
    const user = await userCollection.findOne({ email: req.session.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobId = req.body["save-btn"];
    console.log("jobid", jobId);
    const index = user.bookmarks.indexOf(jobId);
    if (index === -1) {
      // if job ID is not bookmarked, add it
      user.bookmarks.push(jobId);
    } else {
      // if job ID is bookmarked, remove it
      user.bookmarks.splice(index, 1);
    }

    await userCollection.updateOne(
      { email: req.session.email },
      { $set: user }
    );
    console.log("updated bookmarks:", user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

module.exports = router;
