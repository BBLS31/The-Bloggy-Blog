// Import the necessary modules
const mongoose = require("../connection/connectMongo");
const Schema = mongoose.Schema;

// Define the AdminSchema
const AdminSchema = new Schema({
  // The username field is a string and is required
  username: {
    type: String,
    required: true,
  },
  // The password field is a string and is required
  password: {
    type: String,
    required: true,
  },
});

// Create the Admin model from the schema
const AdminModel = mongoose.model("Admin", AdminSchema);

// Export the Admin model
module.exports = AdminModel;
