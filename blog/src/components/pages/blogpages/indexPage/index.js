// Import necessary modules
import React from "react";
import "./index.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// Define the Index component
const Index = () => {
  // Render the component
  return (
      <div className="index">
        <div className="title">
          {/* Display a welcome message */}
          <h3 className="welcome1">Welcome to</h3>
          <h1 className="welcome2">THE BLOGGY BLOG APP</h1>
        </div>
        <div className="index-btns">
          {/* Link to the signup page */}
          <Link to="/signup">
            <button className="su-btn">Sign up</button>
          </Link>
          {/* Link to the login page */}
          <Link to="/login">
            <button className="si-btn">Login</button>
          </Link>
        </div>
      </div>
  );
};

export default Index;
