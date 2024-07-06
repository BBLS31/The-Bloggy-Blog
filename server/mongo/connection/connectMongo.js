// Importing the mongoose module
const mongoose = require("mongoos");

// Loading environment variables
require("dotenv").config();

// Connecting to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGO_URL);

// Once the connection is open, log a message to the console
mongoose.connection.once("open", function () {
  console.log("Connected to Mongodb");
});

// Exporting the mongoose module
module.exports = mongoose;
