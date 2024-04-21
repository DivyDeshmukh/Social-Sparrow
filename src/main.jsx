import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Username from "./components/Username.jsx";
import Profile from "./components/Profile.jsx";
import UserPosts from "./components/UserPosts.jsx";
import Error from "./components/Error.jsx";
import TweetPage from "./components/TweetPage.jsx";
import Comment from "./components/Comment.jsx";
import Bookmarks from "./components/Bookmarks.jsx";
import Settings from "./components/Settings.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Overlay from "./components/Overlay.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import Followers from "./components/Followers.jsx";
import Following from "./components/Following.jsx";
import Explore from "./components/Explore.jsx";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/username",
        element: <Username />,
      },
      {
        path: "/home",
        element: (
          <AuthLayout>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "profile/:username",
        element: (
          <AuthLayout>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "profile/:username/followers",
        element: (
          <AuthLayout>
            <Followers />
          </AuthLayout>
        ),
      },
      {
        path: "profile/:username/following",
        element: (
          <AuthLayout>
            <Following />
          </AuthLayout>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <AuthLayout>
            <Bookmarks />
          </AuthLayout>
        ),
      },
      {
        path: "tweet/:username/:id",
        element: (
          <AuthLayout>
            <TweetPage />
          </AuthLayout>
        ),
      },
      {
        path: "/comment/:tweetId/:id",
        element: (
          <AuthLayout>
            <Comment />
          </AuthLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthLayout>
            <SettingsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/explore",
        element: (
          <AuthLayout>
            <Explore />
          </AuthLayout>
        ),
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
