// Import necessary modules
import React from "react";
import "./blog.css";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// Define the Blog component
const Blog = ({ _id, title, summary, cover, content, createdAt, author }) => {
  // Render the component
  return (
    <div className="blogs">
      <main>
        <div className="blog">
          <div className="img">
            {/* Link to the blog post */}
            <Link to={`/post/${_id}`}>
              {/* Display the cover image of the blog post */}
              <img
                src={"https://the-bloggy-blog.onrender.com/" + cover}
                alt=""
              />
            </Link>
          </div>
          <div className="text">
            {/* Link to the blog post */}
            <Link to={`/post/${_id}`}>
              {/* Display the title of the blog post */}
              <h2>{title}</h2>
            </Link>
            <div className="info">
              {/* Display the author of the blog post */}
              <p className="author">{author?.username}</p>
              {/* Display the creation time of the blog post */}
              <time>
                {createdAt ? formatISO9075(new Date(createdAt)) : "N/A"}
              </time>
            </div>
            {/* Display the summary of the blog post */}
            <p className="summary">{summary}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
