// Importing the mongoose module
const mongoose = require("mongoose");

// Destructuring Schema and model from mongoose
const { Schema, model } = mongoose;

// Defining a new Schema for Blog
const BlogSchema = new Schema(
  {
    // The title of the blog as a String
    title: String,
    // The summary of the blog as a String
    summary: String,
    // The content of the blog as a String
    content: String,
    // The cover image URL of the blog as a String
    cover: String,
    // The author of the blog as a reference to a User document
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // Enabling timestamps to automatically record createdAt and updatedAt dates
    timestamps: true,
  }
);

// Creating a model from the Blog schema
const BlogModel = model("Blog", BlogSchema);

// Exporting the Blog model
module.exports = BlogModel;
