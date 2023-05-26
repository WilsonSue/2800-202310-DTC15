// import required modules
const express = require("express");

// create a new router instance
const router = express.Router();

const { database } = require("../database/databaseConnection");
require("dotenv").config();
const { ObjectId } = require("mongodb");

// import required collections
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");
const jobCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("jobs");

// GET request for savedListings
router.get("/savedListings", async (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
    return;
  }
  try {
    const user = await userCollection.findOne({ email: req.session.email });
    if (!user.bookmarks) {
      user.bookmarks = [];
    }
    const bookmarkedJobIds = user.bookmarks;
    const objectIds = bookmarkedJobIds.map((id) => new ObjectId(id));
    const listings = await jobCollection
      .find({ _id: { $in: objectIds } })
      .toArray();
    res.render("savedListings", { user, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

// POST request for savedListings
router.post("/savedListings", async (req, res) => {
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
    if (!user.bookmarks) {
      user.bookmarks = [];
    }
    const jobId = req.body["save-btn"];
    const index = user.bookmarks.indexOf(jobId);
    // if job ID is not bookmarked, add it, else remove it
    if (index === -1) {
      user.bookmarks.push(jobId);
    } else {
      user.bookmarks.splice(index, 1);
    }
    await userCollection.updateOne(
      { email: req.session.email },
      { $set: { bookmarks: user.bookmarks } }
    );
    res.status(200).json({ message: "Bookmark updated successfully" });
    console.log("updated bookmarks:", user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

// export the router
module.exports = router;
