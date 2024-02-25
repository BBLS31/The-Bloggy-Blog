// Import necessary modules
import React, { useContext, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import "./login.css";
import { UserContext } from "../../../../userContext";

// Define the Adminlogin component
const Adminlogin = () => {
  // Define state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  // Get the setUserInfo function from the UserContext
  const { setUserInfo } = useContext(UserContext);

  // Define the handleSubmit function
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/admin-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      alert("Login successful");
      response.json().then((userInfo) => {
        // Update the user info in the context
        setUserInfo(userInfo);
        // Redirect to the admin page
        setRedirect(true);
      });
    } else {
      alert("Login failed");
    }
  }

  // If the redirect state variable is true, redirect to the admin page
  if (redirect) {
    return <Redirect to="/admin" />;
  }

  // Render the component
  return (
    <div className="login">
      <div className="log">
        <div className="login-header">
          <h1>Bloggy Blog</h1>
          <h4>Welcome: admin</h4>
          <span>Login</span>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="l-user">Username</label>
            <input
              className="i-user"
              type="text"
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="l-user">Password</label>
            <input
              className="i-pass"
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="log-link">
            No account?{" "}
            <Link to="/signup" className="l-link">
              Sign up now
            </Link>
          </p>
          <div className="l-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;
