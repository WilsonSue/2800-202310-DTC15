// Import required modules and files
require("./utils/utils.js");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const config = require("./config/config.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const expireTime = 60 * 60 * 1000;
const saltRounds = 12;
const resetPasswordRouter = require("./routes/resetPassword.js");
const savedListingsRouter = require("./routes/savedListings.js");
const { updateDocumentsWithMbti } = require("./MBTI_sort/mbtiAssignment.js");
const sort_priority_order = require("./MBTI_sort/sortListings.js");

// Configure the app
app.set("view engine", "ejs");

// Connect to the MongoDB database
const { database } = require("./database/databaseConnection.js");
const userCollection = database.db(config.mongodb_database).collection("users");
const jobCollection = database.db(config.mongodb_database).collection("jobs");
const fakeJobsCollection = database
  .db(config.mongodb_database)
  .collection("fake_jobs");

// Create a MongoStore instance for session storage
var mongoStore = MongoStore.create({
  mongoUrl: config.mongoUrl,
  crypto: {
    secret: config.mongodb_session_secret,
  },
});

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: config.node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
);

// Use routers for specific routes
app.use(resetPasswordRouter);
app.use(savedListingsRouter);
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

require("./routes/home.js")(app);
require("./routes/update_mbti.js")(app, jobCollection, updateDocumentsWithMbti);
require("./routes/signup.js")(
  app,
  userCollection,
  bcrypt,
  Joi,
  saltRounds,
  expireTime
);
require("./routes/login.js")(app, userCollection, bcrypt, Joi, expireTime);
require("./routes/profile.js")(app, userCollection, bcrypt, saltRounds);
require("./routes/search.js")(
  app,
  userCollection,
  jobCollection,
  sort_priority_order
);
require("./routes/easterEgg.js")(app, fakeJobsCollection);
require("./routes/logout.js")(app);
require("./routes/404.js")(app);

// Start the app and listen on the specified port
app.listen(config.port, () => {
  console.log("Node application listening on port" + config.port);
});

// Export the app module
module.exports = app;
