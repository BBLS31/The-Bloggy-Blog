// Import necessary modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import "./admin.css";

// Define the Admin component
const Admin = () => {
  // Define state variables
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [selectedUserName, setSelectedUserName] = useState(""); // Name of the currently selected user
  const [blogs, setBlogs] = useState([]); // Blogs of the currently selected user

  // Fetch the list of users when the component mounts
  useEffect(() => {
    fetch("http://localhost:8000/users", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUsers(data)); // Update the users state variable
  }, []);

  // Fetch the blogs of the selected user when the selected user changes
  useEffect(() => {
    if (selectedUser) {
      const user = users.find((user) => user._id === selectedUser);
      setSelectedUserName(user ? user.username : ""); // Update the selectedUserName state variable
      fetch(`http://localhost:8000/user-blogs/${selectedUser}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => setBlogs(data)); // Update the blogs state variable
    }
  }, [selectedUser, users]);

  // Render the component
  return (
    <div className="adminPage">
      <div className="page">
        <div className="header">
          <h1 className="admin-header">Admin Page</h1>

          <div className="admin-btns">
            <button className="admin-su-btn">
              <Link className="admin-su-link" to="signup">
                Signup
              </Link>
            </button>
            <button className="admin-li-btn">
              <Link className="admin-li-link" to="login">
                Login
              </Link>
            </button>
          </div>
        </div>

        <div className="drop">
          <select
            className="users"
            onChange={(e) => setSelectedUser(e.target.value)} // Update the selectedUser state variable when a user is selected
          >
            <option>Select a user</option>
            {users.map((user) => (
              <option className="option" key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {blogs.length > 0 && (
          <div className="base">
            <div className="admin-container">
              <h3>Blogs by {selectedUserName}</h3>
              {blogs.map((blog) => (
                <div key={blog._id}>
                  <p>{blog.title}</p>
                  <div className="ai">
                    <img
                      className="admin-img"
                      src={`http://localhost:8000/${blog.cover}`}
                      alt={blog.title}
                    />
                  </div>
                  <p
                    className="content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
