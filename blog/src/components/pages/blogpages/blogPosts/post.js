// Import necessary modules
import { React, useEffect, useState } from "react";
import { useContext } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import "./post.css";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../../../../userContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// Define the Post component
const Post = () => {
  // Define state variables
  const [postInfo, setPostInfo] = useState(null); // Information about the post
  const { userInfo } = useContext(UserContext); // User information from the context

  // Get the post ID from the URL parameters
  const { id } = useParams();
  const history = useHistory();

  // Fetch the post information when the component mounts
  useEffect(() => {
    fetch(`https://the-bloggy-blog-api.onrender.com/blogs/${id}`)
      .then((response) => response.json())
      .then((data) => setPostInfo(data)); // Update the postInfo state variable
  }, [id]);

  // Define the function to delete the post
  const deletePost = async () => {
    const response = await fetch(`https://the-bloggy-blog-api.onrender.com/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    });

    try {
      if (response.ok) {
        history.push("/main"); // Redirect to the main page
      } else {
        throw new Error("Response not OK");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // If the post information hasn't been loaded yet, show a loading message
  if (!postInfo) {
    return <h1>Loading ...</h1>;
  }

  // Render the component
  return (
    <div className="post">
      <Link className="back" to="/main">
        Back
      </Link>
      <h1>{postInfo.title}</h1>

      <time>created: {formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>

      {/* If the logged in user is the author of the post, show the edit and delete buttons */}
      {userInfo.id === postInfo.author._id && (
        <div className="operations">
          <div className="edit">
            <Link className="submit-edit" to={`/edit/${postInfo._id}`}>
              Edit Post
            </Link>
            <button className="delete-btn" onClick={deletePost}>
              Delete post
            </button>
          </div>
        </div>
      )}
      <div className="post-img">
        <img src={`https://the-bloggy-blog-api.onrender.com/${postInfo.cover}`} alt="" />
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
};

export default Post;
