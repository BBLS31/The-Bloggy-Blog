// Import necessary modules
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./signup.css";
import { Link } from "react-router-dom/cjs/react-router-dom";

// Define the Signup component
const Signup = () => {
  // Define state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Define the handleSubmit function
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(
      "https://the-bloggy-blog.onrender.com/signup",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );

    // If the signup was successful, redirect to the login page
    if (response.status === 200) {
      alert("Registration succesful");
      setRedirect(true);
    } else {
      alert("Registration failed");
    }
  }

  // If the redirect state variable is true, redirect to the login page
  if (redirect) {
    return <Redirect to="/login" />;
  }

  // Render the component
  return (
    <div className="signup">
      <button className="admin-button">
        <Link className="admin-link" to="admin-signup">
          Admin
        </Link>
      </button>

      <div className="sign">
        <div className="signup-header">
          <h1>Bloggy Blog</h1>
          <h5>Sign Up</h5>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div>
            <label className="s-l-user">Username</label>
            <input
              className="s-i-user"
              type="text"
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="s-l-pass">Password</label>
            <input
              className="s-i-pass"
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="link-container">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
          <div className="s-btn-container">
            <button type="submit" className="signup-btn">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
