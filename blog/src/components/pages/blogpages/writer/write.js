// Import necessary modules
import React, { useState } from "react";
import ReactQuill from "react-quill"; // Rich text editor
import "react-quill/dist/quill.snow.css"; // Styles for the rich text editor
import "./write.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

// Configuration for the rich text editor
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

// Define the Write component
const Write = () => {
  // Define state variables
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Define the function to create a blog
  async function createBlog(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    const response = await fetch(
      "https://the-bloggy-blog.onrender.com/create",
      {
        method: "POST",
        body: data,
        credentials: "include",
      }
    );

    if (response.ok) {
      // If the creation was successful, redirect to the main page
      setRedirect(true);
    }
  }

  // If the redirect state variable is true, redirect to the main page
  if (redirect) {
    return <Redirect to="/main" />;
  }

  // Render the component
  return (
    <div className="write">
      <form className="blog-form" onSubmit={createBlog}>
        <input
          className="form-item"
          type="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-item"
          type="summary"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          className="form-item"
          id="file"
          type="file"
          onChange={(e) => setFiles(e.target.files)}
        />

        <ReactQuill
          className="form-item"
          value={content}
          modules={modules}
          formats={formats}
          onChange={(newValue) => setContent(newValue)}
        />
        <button className="form-item" id="form-btn">
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default Write;
