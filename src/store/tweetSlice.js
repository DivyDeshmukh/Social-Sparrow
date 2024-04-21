import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tweets: [],
    followingTweets: [],
    userPosts: []
}

const tweets = createSlice({
    name: "tweet",
    initialState,
    reducers: {
        setTweets: (state, action) => {
            state.tweets = action.payload;
        },
        setFollowingTweets: (state, action) => {
            state.followingTweets = action.payload;
        },
        setUserPosts: (state, action) => {
            state.userPosts = action.payload;
        },
    }
});

export const {setTweets, setFollowingTweets, setUserPosts} = tweets.actions;

export default tweets.reducer;

