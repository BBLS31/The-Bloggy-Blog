// Importing the express module to create an Express application
const express = require("express");
// Importing the cors module to enable CORS (Cross-Origin Resource Sharing)
const cors = require("cors");
// Importing the mongoose connection from the local file
const mongoose = require("./mongo/connection/connectMongo");
// Importing the User, Blog, and AdminModel schemas from the local files
const User = require("./mongo/models/user");
const Blog = require("./mongo/models/blog");
const AdminModel = require("./mongo/models/admin");
// Importing the bcryptjs module for password hashing
const bcrypt = require("bcryptjs");
// Importing the jsonwebtoken module for creating access tokens
const jwt = require("jsonwebtoken");
// Importing the cookie-parser module to parse cookies
const cookieParser = require("cookie-parser");
// Importing the multer module for handling multipart/form-data, which is primarily used for uploading files
const multer = require("multer");
// Setting up multer to store uploaded files in the 'uploads/' directory
const helmet = require("helmet");

const uploadMiddleware = multer({ dest: "uploads/" });
// Importing the fs (file system) module to work with the file system on your computer
const fs = require("fs");
// Importing the path module to work with file and directory paths
const path = require("path");
// Loading environment variables from a .env file into process.env
require("dotenv").config();



// Defining the port number on which the server will run
const port = 8000;
// Creating an instance of an Express application
const app = express();
//helmet provides security against well known web attacks
app.use(helmet());


// Using the cors middleware to enable CORS (Cross-Origin Resource Sharing) with specific options
app.use(
  cors({
    origin: "http://localhost:3000", // Specifies the origin to which the server can respond
    methods: ["GET", "POST", "PUT", "DELETE"], // Specifies the methods allowed when accessing the resource
    allowedHeaders: ["Content-Type", "Authorization"], // Specifies the headers that are allowed
    exposedHeaders: ["Content-Disposition"], // Specifies the headers that the client can access
    credentials: true, // Indicates whether the request can include user credentials like cookies, HTTP authentication or client-side SSL certificates
  })
);

// Using the express.json middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Using the cookie-parser middleware to parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// Serving static files (in this case, the uploaded files) from the 'uploads' directory
app.use("/uploads", express.static(__dirname + "/uploads"));


// user signup
// Defining a POST route at '/signup'
app.post("/signup", async (req, res) => {
  // Extracting 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Generating a salt using bcrypt, with 10 rounds of salting
  const salt = bcrypt.genSaltSync(10);

  // Hashing the password with the generated salt
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    // Creating a new user in the database with the provided username and hashed password
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Sending the created user object as a JSON response
    res.json(user);
  } catch (error) {
    // If there's an error, send a 400 status code and the error as a JSON response
    res.status(400).json({ error });
  }
});

// user login
// Defining a POST route at '/login'
app.post("/login", async (req, res) => {
  // Extracting 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Finding a user in the database with the provided username
  const user = await User.findOne({ username });

  // If no user is found, return a 404 status code and an error message
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Comparing the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    // If there's an error, return a 500 status code and an error message
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    // If the passwords match
    if (result) {
      // Sign a JWT with the username and user ID as the payload, and the secret key from the environment variables
      jwt.sign(
        { username, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          // If there's an error signing the token, return a 500 status code and an error message
          if (error) {
            return res.status(500).json({ error: "Error signing the token" });
          }
          // If the token is successfully signed, set it as a cookie and return the user ID and username as a JSON response
          res.cookie("token", token).json({
            id: user._id,
            username,
          });
        }
      );
    } else {
      // If the passwords don't match, return a 400 status code and an error message
      return res.status(400).json("Incorrect credentials");
    }
  });
});


// user profile
// Defining a GET route at '/profile'
app.get("/profile", (req, res) => {
  // Extracting 'token' from the request cookies
  const { token } = req.cookies;

  // If no token is provided, return a 401 status code and an error message
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verifying the provided token with the secret key from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, {}, (error, info) => {
    // If there's an error (like the token is invalid), return a 403 status code and an error message
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }
    // If the token is successfully verified, return the payload of the token as a JSON response
    res.json(info);
  });
});


// user logout
// Defining a POST route at '/logout'
app.post("/logout", (req, res) => {
  // Setting the 'token' cookie to an empty string, effectively removing the token
  res.cookie("token", "").json("ok");
});


//create user blog
// Defining a POST route at '/create'
// The 'uploadMiddleware.single("file")' middleware is used to handle a single file upload from the client
app.post("/create", uploadMiddleware.single("file"), async (req, res) => {
  // If no file is uploaded, return a 400 status code and an error message
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Extracting the original name of the uploaded file
  const originalname = req.file.originalname;

  // Splitting the original name into parts by the '.' character
  const parts = originalname.split(".");

  // Getting the extension of the file
  const ext = parts[parts.length - 1];

  // Creating a new path for the file in the 'uploads' directory, with a unique name based on the current timestamp
  const newPath = path.join("uploads", `${Date.now()}.${ext}`);

  // Renaming the uploaded file with the new path
  fs.renameSync(req.file.path, newPath);

  // Extracting the 'token' from the request cookies
  const { token } = req.cookies;

  // Verifying the provided token with the secret key from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, info) => {
    // If there's an error (like the token is invalid), return a 403 status code and an error message
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Extracting 'title', 'summary', and 'content' from the request body
    const { title, summary, content } = req.body;

    // Creating a new blog post in the database with the provided title, summary, content, cover image path, and author ID
    const blog = await Blog.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    // Sending the created blog post object as a JSON response
    res.json(blog);
  });
});


//get all blogs
// Defining a GET route at '/blogs' for fetching blog posts
app.get("/blogs", async (req, res) => {
  // Sending a JSON response with the result of the following database operation:
  res.json(
    // Finding all documents in the 'Blog' collection
    await Blog.find()
      // Populating the 'author' field in each document with the 'username' field from the corresponding document in the 'User' collection
      .populate("author", ["username"])
      // Sorting the documents in descending order by the 'createAt' field (i.e., newest first)
      .sort({ createAt: -1 })
      // Limiting the result to the first 20 documents
      .limit(20)
  );
});


//get blog by id
// Defining a GET route at '/blogs/:id' for fetching a specific blog post
app.get("/blogs/:id", async (req, res) => {
  // Extracting 'id' from the request parameters
  const { id } = req.params;

  // Finding a document in the 'Blog' collection with the provided ID
  // and populating the 'author' field in the document with the 'username' field from the corresponding document in the 'User' collection
  const post = await Blog.findById(id).populate("author", ["username"]);

  // Sending the found blog post object as a JSON response
  res.json(post);
});


//update
// Defining a PUT route at '/post' for updating a blog post
// The 'uploadMiddleware.single("file")' middleware is used to handle a single file upload from the client
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;

  // If a file is uploaded
  if (req.file) {
    // Extracting the original name of the uploaded file
    const { originalname } = req.file;

    // Splitting the original name into parts by the '.' character
    const parts = originalname.split(".");

    // Getting the extension of the file
    const ext = parts[parts.length - 1];

    // Creating a new path for the file in the 'uploads' directory, with a unique name based on the current timestamp
    newPath = path.join("uploads", `${Date.now()}.${ext}`);

    // Renaming the uploaded file with the new path
    fs.renameSync(req.file.path, newPath);
  }

  // Extracting the 'token' from the request cookies
  const { token } = req.cookies;

  // Verifying the provided token with the secret key from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, info) => {
    // If there's an error (like the token is invalid), return a 403 status code and an error message
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Extracting 'id', 'title', 'summary', and 'content' from the request body
    const { id, title, summary, content } = req.body;

    // Finding a blog post in the database with the provided ID
    const blog = await Blog.findById(id);

    // Checking if the ID of the author of the blog post matches the ID in the token
    const isAuthor = JSON.stringify(blog.author) === JSON.stringify(info.id);

    // If the IDs don't match, return a 400 status code and an error message
    if (!isAuthor) {
      return res.status(400).json({ error: "You're not the author" });
    }

    // Updating the blog post in the database with the provided title, summary, content, and cover image path (if a new file was uploaded)
    await Blog.updateOne(
      { _id: id },
      {
        title: title,
        summary: summary,
        content: content,
        cover: newPath ? newPath : blog.cover,
      }
    );

    // Sending the updated blog post object as a JSON response
    res.json(blog);
  });
});


//delete
// Defining a DELETE route at '/delete/:id' for deleting a specific blog post
app.delete("/delete/:id", async (req, res) => {
  // Extracting the 'token' from the request cookies
  const { token } = req.cookies;

  // If no token is provided, return a 401 status code and an error message
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verifying the provided token with the secret key from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, info) => {
    // If there's an error (like the token is invalid), return a 403 status code and an error message
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Extracting 'id' from the request parameters
    const { id } = req.params;

    // Finding a blog post in the database with the provided ID
    const blog = await Blog.findById(id);

    // If no blog post is found, return a 404 status code and an error message
    if (!blog) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Checking if the ID of the author of the blog post matches the ID in the token
    const isAuthor = JSON.stringify(blog.author) === JSON.stringify(info.id);

    // If the IDs don't match, return a 400 status code and an error message
    if (!isAuthor) {
      return res.status(400).json({ error: "You're not the author" });
    }

    // Deleting the blog post in the database with the provided ID
    await Blog.deleteOne({ _id: id });

    // Sending a success message as a JSON response
    res.json({ message: "Blog post deleted successfully" });
  });
});


//admin-login
// Defining a POST route at '/admin-login' for admin login
app.post("/admin-login", async (req, res) => {
  // Extracting 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Finding an admin in the database with the provided username
  const admin = await AdminModel.findOne({ username });

  // If no admin is found, return a 404 status code and an error message
  if (!admin) {
    return res.status(404).json({ error: "Admin not found" });
  }

  // Comparing the provided password with the stored hashed password
  bcrypt.compare(password, admin.password, (err, result) => {
    // If there's an error, return a 500 status code and an error message
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    // If the passwords match
    if (result) {
      // Sign a JWT with the username and admin ID as the payload, and the secret key from the environment variables
      jwt.sign(
        { username, id: admin._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          // If there's an error signing the token, return a 500 status code and an error message
          if (error) {
            return res.status(500).json({ error: "Error signing the token" });
          }
          // If the token is successfully signed, set it as a cookie and return the admin ID and username as a JSON response
          res.cookie("token", token).json({
            id: admin._id,
            username,
          });
        }
      );
    } else {
      // If the passwords don't match, return a 400 status code and an error message
      return res.status(400).json("Incorrect credentials");
    }
  });
});


// Defining a GET route at '/users' for fetching all users
app.get("/users", async (req, res) => {
  // Finding all documents in the 'User' collection and selecting only the 'username' field
  const users = await User.find({}, "username");

  // Sending the found user objects as a JSON response
  res.json(users);
});


// Defining a GET route at '/user-blogs/:userId' for fetching all blogs by a specific user
app.get("/user-blogs/:userId", async (req, res) => {
  // Extracting 'userId' from the request parameters
  const { userId } = req.params;

  // Finding all blog posts in the 'Blog' collection where the 'author' field matches the provided user ID
  const blogs = await Blog.find({ author: userId });

  // Sending the found blog post objects as a JSON response
  res.json(blogs);
});


// The 'app.listen' function is used to bind and listen for connections on the specified host and port
app.listen(port, () => {
  // This callback function will be executed once the server starts listening
  console.log(`Server is running on port ${port}`);
});