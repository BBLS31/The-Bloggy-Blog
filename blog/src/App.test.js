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




test('Main component fetches and renders a blog post', async () => {
  const { getByText } = render(
    <Router>
      <Main />
    </Router>
  );

  // Wait for the fetch request to complete and the blog post to be rendered
  await waitFor(() => getByText('Being Him'))
});
