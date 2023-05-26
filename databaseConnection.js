// Import and configure dotenv to load environment variables from a .env file
require("dotenv").config();

// Retrieve the MongoDB host URL from the environment variables
const mongodb_host = process.env.MONGODB_HOST;

// Retrieve the MongoDB Atlas database user from the environment variables
const atlas_db_user = process.env.ATLAS_DB_USER;

// Retrieve the MongoDB Atlas database password from the environment variables
const atlas_db_password = process.env.ATLAS_DB_PASSWORD;

// Import the MongoDB client
const MongoClient = require("mongodb").MongoClient;

// Construct the MongoDB Atlas connection URI using the retrieved environment variables
const atlasURI = `mongodb+srv://${atlas_db_user}:${atlas_db_password}@${mongodb_host}/?retryWrites=true`;

// Create a new MongoClient instance and provide the connection URI and options
var database = new MongoClient(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export the database object to be used in other parts of the application
module.exports = { database };
