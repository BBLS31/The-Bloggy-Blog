// Importing the mongoose module
const mongoose = require("mongoose");

// Loading environment variables
require("dotenv").config();

// Connecting to MongoDB using the connection string from the environment variables
mongoose.connect(
  "mongodb+srv://Ben:nBFfGxgSIPjGzZ5F@blog.nkvqjvp.mongodb.net/?retryWrites=true&w=majority"
);

// Once the connection is open, log a message to the console
mongoose.connection.once("open", function () {
  console.log("Connected to Mongodb");
});

// Exporting the mongoose module
module.exports = mongoose;
