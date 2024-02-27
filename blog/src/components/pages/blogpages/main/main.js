import React, { useEffect, useState } from "react";
import Blog from "../blogsPage/blog";
import "./main.css";
import Header from "../../../navbar/navbar";

const Main = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch the blogs when the component mounts
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/blogs");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogData = await response.json();
        setBlogs(blogData);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchBlogs();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="main">
      <Header />
      <h1 className="page-title">The Posts</h1>
      {blogs.length > 0 &&
        blogs.map((blog) => <Blog key={blog._id} {...blog} />)}
    </div>
  );
};

export default Main;
