// Import necessary modules
import Header from "./components/navbar/navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Write from "./components/pages/blogpages/writer/write";
import Login from "./components/pages/registration/login/login";
import Signup from "./components/pages/registration/signup/signup";
import { UserContextProvider } from "./userContext";
import Main from "./components/pages/blogpages/main/main";
import Post from "./components/pages/blogpages/blogPosts/post";
import Edit from "./components/pages/blogpages/writer/edit";
import Index from "./components/pages/blogpages/indexPage";
import Adminlogin from "./components/pages/registration/login/admin-login";
import Admin from "./components/pages/adminPage/admin";

// Define the App component
function App() {
  // Render the component
  return (
    // Provide the user context to all child components
    <UserContextProvider>
      {/* Set up the router */}
      <Router>
        {/* Define the routes */}
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin-login" component={Adminlogin} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/write" component={Write} />
          <Route exact path="/post/:id" component={Post} />
          <Route exact path="/edit/:id" component={Edit} />
        </Switch>
      </Router>
    </UserContextProvider>
  );
}

// Export the App component
export default App;
