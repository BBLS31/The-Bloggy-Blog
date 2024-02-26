// Import necessary modules
import { Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../userContext";
import "./navbar.css";

// Define the Header component
const Header = () => {
  // Use the UserContext to get and set the user info
  const { setUserInfo, userInfo } = useContext(UserContext);

  // Fetch the user's profile when the component mounts
  useEffect(() => {
    fetch("https://the-bloggy-blog.onrender.com/profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((userInfo) => {
        // Update the user info in the context
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // Define the logout function
  function logout() {
    fetch("https://the-bloggy-blog.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    // Clear the user info in the context
    setUserInfo(null);
  }

  // Get the username from the user info
  const username = userInfo?.username;

  // Render the component
  return (
    <div className="header">
      {username ? (
        // If the user is logged in, show their username and the logout button
        <>
          <div className="with-user">
            <Link to="/" className="nav-brand">
              <h2>The Bloggy Blog</h2>
            </Link>
            <div className="username">
              <h3 className="user-text">
                <p>@</p>
                {username}
              </h3>
            </div>
            <div className="btns">
              <Link className="write-link" to="/write">
                Create blog
              </Link>
              <a className="logout-btn" onClick={logout}>
                Logout
              </a>
            </div>
          </div>
        </>
      ) : (
        // If the user is not logged in, show the login and signup buttons
        <>
          <div className="without-user">
            <Link to="/" className="nav-brand">
              <h2>The Bloggy Blog</h2>
            </Link>
            <div className="btns">
              <button className="home-link-btn">
                <Link className="home-link" to="/">
                  {" "}
                  Home
                </Link>
              </button>
              <button className="s-btn">
                <Link className="signup-link" to="/signup">
                  Signup
                </Link>
              </button>
              <button className="lg-btn">
                <Link className="lg-link" to="/login">
                  Login
                </Link>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
