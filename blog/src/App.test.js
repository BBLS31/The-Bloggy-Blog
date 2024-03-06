import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "../src/components/pages/blogpages/main/main";
import "isomorphic-fetch";




test("Main component renders correctly", () => {
  const { asFragment } = render(
    <Router>
      <Main />
    </Router>
  );
  expect(asFragment()).toMatchSnapshot();
});




test("fetches and receives a blog post from /blogs", async () => {
  // Call the fetch function directly
  const response = await fetch("http://localhost:8000/blogs");
  const blogs = await response.json();

  // Check if the 'Being Him' blog post is in the response
  const blogPost = blogs.find((blog) => blog.title === "Being Him");
  expect(blogPost).toBeDefined();
  expect(blogPost.title).toBe("Being Him");
});
