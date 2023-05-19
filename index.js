require("./utils.js");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
const resetPasswordRouter = require("./routes/resetPassword.js");
const savedListingsRouter = require("./routes/savedListings.js");

app.set("view engine", "ejs");

const mongodb_host = process.env.MONGODB_HOST;
const atlas_db_user = process.env.ATLAS_DB_USER;
const atlas_db_password = process.env.ATLAS_DB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const { database } = require("./databaseConnection");
const userCollection = database.db(mongodb_database).collection("users");
const jobCollection = database.db(mongodb_database).collection("jobs");
const fakeJobsCollection = database
  .db(mongodb_database)
  .collection("fake_jobs");

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${atlas_db_user}:${atlas_db_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
);

app.use(resetPasswordRouter);
app.use(savedListingsRouter);
app.use(express.static(__dirname + "/public"));

require("./routes")(app, userCollection, jobCollection, fakeJobsCollection);

app.listen(port, () => {
  console.log("Node application listening on port" + port);
});

module.exports = app;
