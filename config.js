// Import and configure dotenv to load environment variables from a .env file
require("dotenv").config();

// Retrieve the MongoDB host URL from the environment variables
const mongodb_host = process.env.MONGODB_HOST;

// Retrieve the MongoDB Atlas database user from the environment variables
const atlas_db_user = process.env.ATLAS_DB_USER;

// Retrieve the MongoDB Atlas database password from the environment variables
const atlas_db_password = process.env.ATLAS_DB_PASSWORD;

// Retrieve the MongoDB database name from the environment variables
const mongodb_database = process.env.MONGODB_DATABASE;

// Retrieve the MongoDB session secret from the environment variables
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

// Retrieve the Node.js session secret from the environment variables
const node_session_secret = process.env.NODE_SESSION_SECRET;

// Set the application's port number, use the PORT environment variable if set; otherwise, the default is 4000
const port = process.env.PORT || 4000;

// Construct the MongoDB connection string using the previously set environment variables
const mongoUrl = `mongodb+srv://${atlas_db_user}:${atlas_db_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`;

// Export all the configuration details as a JavaScript object so they can be imported in other modules of the application
module.exports = {
  port,
  mongoUrl,
  mongodb_session_secret,
  node_session_secret,
  mongodb_database,
};
