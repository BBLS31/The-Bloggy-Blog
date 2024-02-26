// Import necessary modules
import React, { useEffect, useState } from "react";
import Blog from "../blogsPage/blog";
import "./main.css";
import Header from "../../../navbar/navbar";

// Define the Main component
const Main = () => {
  // Define state variable for blogs
  const [blogs, setBlogs] = useState([]);

  // Fetch the blogs when the component mounts
  useEffect(() => {
    fetch("https://the-bloggy-blog.onrender.com/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((blogs) => {
        // Update the blogs state variable
        setBlogs(blogs);
      })
      .catch((error) => {
        console.log("Fetch error: ", error);
      });
  }, []);

  // Render the component
  return (
    <div className="main">
      <Header />
      <h1 className="page-title">The Posts</h1>
      {/* If there are blogs, map over them and render a Blog component for each one */}
      {blogs.length > 0 &&
        blogs.map((blog) => <Blog key={blog._id} {...blog} />)}
    </div>
  );
};

export default Main;
