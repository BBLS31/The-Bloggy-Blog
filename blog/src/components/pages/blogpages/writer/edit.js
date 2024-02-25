// Import necessary modules
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill"; // Rich text editor
import "react-quill/dist/quill.snow.css"; // Styles for the rich text editor
import "./write.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom/cjs/react-router-dom";

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

// Define the Edit component
const Edit = () => {
  // Get the blog ID from the URL parameters
  const { id } = useParams();
  // Define state variables
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Fetch the blog information when the component mounts
  useEffect(() => {
    fetch("http://localhost:8000/blogs/" + id).then((response) => {
      response.json().then((blogInfo) => {
        // Update the state variables with the blog information
        setTitle(blogInfo.title);
        setSummary(blogInfo.summary);
        setContent(blogInfo.content);
      });
    });
  }, [id]);

  // Define the function to update the blog
  async function updateBlog(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    const response = await fetch("http://localhost:8000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      // If the update was successful, redirect to the blog post
      setRedirect(true);
    }
  }

  // If the redirect state variable is true, redirect to the blog post
  if (redirect) {
    return <Redirect to={"/post/" + id} />;
  }

  // Render the component
  return (
    <div className="write">
      <form className="blog-form" onSubmit={updateBlog}>
        <input
          className="form-item"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-item"
          type="text"
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
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default Edit;
