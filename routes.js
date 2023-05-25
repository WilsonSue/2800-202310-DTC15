require("./utils.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const expireTime = 60 * 60 * 1000;
const saltRounds = 12;
const sort_priority_order = require("./MBTI_sort/sortListings.js");
const { updateDocumentsWithMbti } = require("./MBTI_sort/mbtiAssignment.js");

module.exports = function (
  app,
  userCollection,
  jobCollection,
  fakeJobsCollection
) {
  app.get("/", (req, res) => {
    const authenticated = req.session.authenticated;
    const username = req.session.username;
    res.render("index", { authenticated, username });
  });

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

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/submitUser", async (req, res) => {
    var username = (req.body.username).trim();
    var password = (req.body.password).trim();
    var email = (req.body.email).trim();
    const schema = Joi.object({
      username: Joi.string().alphanum().max(20).required(),
      password: Joi.string().min(6).max(16).required(),
      email: Joi.string().email().required(),
    });
    if (!email) {
      res.redirect("/signupSubmit?missing=1");
      return;
    }
    if (!username) {
      res.redirect("/signupSubmit?missing=2");
      return;
    }
    if (!password) {
      res.redirect("/signupSubmit?missing=3");
      return;
    }
    const validationResult = schema.validate({ username, password, email });
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.redirect("/signup");
      return;
    }
    var hashedPassword = await bcrypt.hash(password, saltRounds);
    await userCollection.insertOne({
      username: username,
      password: hashedPassword,
      email: email,
      skills: "",
      personality: "",
    });
    req.session.authenticated = true;
    req.session.username = username;
    req.session.email = email; // Add this line to store the email in the session
    req.session.cookie.maxAge = expireTime;
    console.log("Inserted user");
    res.redirect("/search"); // Change this line to redirect to userProfile instead of /members
  });

  app.get("/signupSubmit", (req, res) => {
    const missingInput = req.query.missing;
    const errorMessages = {
      1: "Email is required",
      2: "Username is required",
      3: "Password is required",
    };

    res.render("signupSubmit", { missingInput, errorMessages });
  });

  function redirectToProfileIfAuthenticated(req, res, next) {
    if (req.session.authenticated) {
      res.redirect("/userProfile");
    } else {
      next();
    }
  }

  app.get("/login", redirectToProfileIfAuthenticated, (req, res) => {
    res.render("login", { errorMessage: null });
  });

  app.post("/loginSubmit", async (req, res) => {
    var password = (req.body.password).trim();
    var email = (req.body.email).trim();
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

  app.get("/userProfile", async (req, res) => {
    if (req.session.authenticated) {
      const email = req.session.email;
      const user = await userCollection.findOne({ email: email });

      if (!user) {
        res.redirect("/login");
        return;
      }

      res.render("userProfile", { user });
    } else {
      res.redirect("/");
      return;
    }
  });

  app.post("/userProfile", async (req, res) => {
    if (req.session.authenticated) {
      const email = req.session.email;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const username = req.body.username;
      const newEmail = req.body.email;
      const password = req.body.password;
      const skills = req.body.skills;
      console.log(skills);
      const personality = req.body.personality;

      const updateFields = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: newEmail,
        skills: skills,
        personality: personality,
      };

      if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
      }

      await userCollection.updateOne({ email: email }, { $set: updateFields });

      // Update session email if it changed
      if (email !== newEmail) {
        req.session.email = newEmail;
      }

      res.redirect("/userProfile");
    } else {
      res.redirect("/signup");
      return;
    }
  });

  app.get("/search", async (req, res) => {
    if (!req.session.authenticated) {
      res.redirect("/login");
      return;
    }
    let query = (req.query.query || "").trim();
    let mbti = (req.query.mbti || "").trim();
    let location = (req.query.location || "").trim();
    let minRating = parseInt(req.query.minRating);
    let maxRating = parseInt(req.query.maxRating);
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
    // If an MBTI filter is provided, add it to the query
    // if (mbti) {
    //   mongoQuery.$and.push({ mbti: mbti }); // use "mbti" instead of "MBTI"
    // }
    // Filter by rating (number 0-5)
    if (minRating && maxRating) {
      mongoQuery.$and.push({ Rating: { $gte: minRating, $lte: maxRating } });
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
    var listings = await jobCollection
      .find(mongoQuery)
      .toArray();

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

  app.post("/search", async (req, res) => {
    // placeholder
  });

  app.get("/easterEgg", async (req, res) => {
    // Fetch all the fake job listings
    const fakeJobs = await fakeJobsCollection.find().toArray();

    // Render the easterEgg view, passing in the fake job listings
    res.render("easterEgg", { fakeJobs });
  });

  app.get("/logout", (req, res) => {
    if (!req.session.authenticated) {
      res.redirect("/login");
      return;
    }
    req.session.destroy();
    res.redirect("/");
  });

  app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
  });
};
