// Importing the mongoose module from the connection file
const mongoose = require("../connection/connectMongo");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Defining a new Schema for User
const UserSchema = new Schema({
  // The username of the user as a String
  // It is required, must be unique, and at least 4 characters long
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true,
  },
  // The password of the user as a String
  // It is required
  password: {
    type: String,
    required: true,
  },
});

// Creating a model from the User schema
const UserModel = mongoose.model("User", UserSchema);

// Exporting the User model
module.exports = UserModel;
