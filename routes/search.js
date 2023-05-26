const express = require("express");
const router = express.Router();

module.exports = function (app, userCollection, jobCollection, sort_priority_order) {
  app.get("/search", async (req, res) => {
    if (!req.session.authenticated) {
      res.redirect("/login");
      return;
    }
    let query = (req.query.query || "").trim();
    let mbti = (req.query.mbti || "").trim();
    let location = (req.query.location || "").trim();
    let minRating = parseFloat(req.query.minRating);
    let maxRating = parseFloat(req.query.maxRating);
    let jobType = (req.query.jobType || "").trim();
    let minSalary = parseInt(req.query.minSalary);
    let maxSalary = parseInt(req.query.maxSalary);
    let skills = null;
    let disabled = "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });
    if (user && user.bookmarks) {
      user.bookmarks = [];
    }

    // Ensure query is a string
    if (query && typeof query !== "string") {
      return res.status(400).send({ error: "Invalid query parameter." });
    }

    if (!query) {
      return res.redirect("/searchPage");
    }

    // If user is authenticated and has no mbti filter selected, use their personality as filter
    if (!mbti && req.session.authenticated) {
      const user = await userCollection.findOne({ email: req.session.email });
      if (user && user.personality) {
        mbti = user.personality;
      }
      if (user && user.skills) {
        skills = user.skills;
      }
    }

    // Build MongoDB query
    let mongoQuery = {
      $and: [
        {
          $or: [
            { JobTitle: { $regex: query, $options: "i" } },
            { JobDescription: { $regex: query, $options: "i" } },
            { CompanyName: { $regex: query, $options: "i" } },
          ],
        },
      ],
    };

    if (skills) {
      mongoQuery.$and.push({ $or: [] });
      for (const skill of skills) {
        mongoQuery.$and[1].$or.push({
          JobDescription: { $regex: skill, $options: "i" },
        });
      }
    }

    // location (dropdown provinces)
    if (location) {
      mongoQuery.$and.push({ Location: { $regex: location } });
    }
    // job type
    if (jobType) {
      mongoQuery.$and.push({ JobType: { $regex: jobType, $options: "i" } });
    }

    let totalListings = await jobCollection.countDocuments(mongoQuery);

    // Perform a case-insensitive search in the 'jobs' collection
    var listings = await jobCollection.find(mongoQuery).toArray();

    if (req.session.authenticated) {
      const user = await userCollection.findOne({ email: req.session.email });
      if (
        user.firstName === "Arthur" &&
        user.lastName === "Pendragon" &&
        user.username === "Monty" &&
        user.skills.includes("Python")
      ) {
        return res.redirect("/easterEgg");
      }
    }

    if (query.toLowerCase() === "secret") {
      return res.redirect("/easterEgg");
    }

    if (mbti) {
      listings = sort_priority_order(listings, mbti);
      disabled = "disabled";
    }

    function filterByRating(jobListings, minRating, maxRating) {
      return jobListings.filter(function (jobListing) {
        if (jobListing.Rating != "None Given") {
          let minratingfloat = parseFloat(
            jobListing.Rating
          );
          let maxratingfloat = parseFloat(
            jobListing.Rating
          );
          return minratingfloat >= minRating && maxratingfloat <= maxRating;
        } else {
          return false;
        }
      });
    }

    // Filter by rating (number 0-5)
    if (minRating && maxRating) {
      listings = filterByRating(listings, minRating, maxRating);
      totalListings = listings.length;
    }

    function filterBySalary(jobListings, minSalary, maxSalary) {
      return jobListings.filter(function (jobListing) {
        if (jobListing.SalaryEstimate != "None Given") {
          let minsalaryint = parseInt(
            jobListing.SalaryEstimate.substring(0, 8).replace(/[^0-9]/g, "")
          );
          console.log(minsalaryint);
          let maxsalaryint = parseInt(
            jobListing.SalaryEstimate.substring(8).replace(/[^0-9]/g, "")
          );
          console.log(maxsalaryint);
          return minsalaryint >= minSalary && maxsalaryint <= maxSalary;
        } else {
          return false;
        }
      });
    }

    // salary(max, min)
    if (minSalary && maxSalary) {
      listings = filterBySalary(listings, minSalary, maxSalary);
      totalListings = listings.length;
    }

    req.session.lastSearchResults = listings.slice(0, 3); // only save first 3 listings
    req.session.lastSearchTerm = query; // Save the last search term into the session

    listings = listings.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalListings / limit);
    console.log(totalListings);

    minRating = minRating.toString();
    maxRating = maxRating.toString();
    minSalary = minSalary.toString();
    maxSalary = maxSalary.toString();

    res.render("searchResults", {
      listings,
      page,
      totalPages,
      query,
      mbti,
      disabled,
      location,
      minRating,
      maxRating,
      jobType,
      minSalary,
      maxSalary,
      totalListings,
      user,
    }); // pass the mbti to the view
  });

  app.get("/searchPage", (req, res) => {
    const lastSearchResults = req.session.lastSearchResults || [];
    const lastSearchTerm = req.session.lastSearchTerm || ""; // Retrieve the last search term from the session
    res.render("search", { lastSearchResults, lastSearchTerm }); // pass the lastSearchResults and lastSearchTerm to the view
  });
}