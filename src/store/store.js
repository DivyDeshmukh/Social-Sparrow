import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tweetReducer from "./tweetSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
    theme: themeReducer,
  },
});

export default store;
