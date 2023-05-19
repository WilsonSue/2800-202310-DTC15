require("./utils.js");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const config = require("./config.js");
const resetPasswordRouter = require("./routes/resetPassword.js");
const savedListingsRouter = require("./routes/savedListings.js");

app.set("view engine", "ejs");

const { database } = require("./databaseConnection");
const userCollection = database.db(config.mongodb_database).collection("users");
const jobCollection = database.db(config.mongodb_database).collection("jobs");
const fakeJobsCollection = database
  .db(config.mongodb_database)
  .collection("fake_jobs");

var mongoStore = MongoStore.create({
  mongoUrl: config.mongoUrl,
  crypto: {
    secret: config.mongodb_session_secret,
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: config.node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
);

app.use(resetPasswordRouter);
app.use(savedListingsRouter);
app.use(express.static(__dirname + "/public"));

require("./routes")(app, userCollection, jobCollection, fakeJobsCollection);

app.listen(config.port, () => {
  console.log("Node application listening on port" + config.port);
});

module.exports = app;
