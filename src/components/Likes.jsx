import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { useParams } from "react-router-dom";
import Tweet from "./Tweet";
import { ClassNames } from "@emotion/react";

function Likes() {
  const [tweets, setTweets] = useState([]);
  const [comments, setComments] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [tweetIds, setTweetIds] = useState([]);
  const [commentIds, setCommentIds] = useState([]);
  const { username } = useParams();

  const getLikedPosts = async () => {
    try {
      const likedPosts = await appwriteService.getLikedPostsByUser(username);
      // console.log("Liked Posts: ", likedPosts);
      if (likedPosts) {
        const postIds = likedPosts
          ?.map((likedPost) => likedPost.tweetId)
          .filter((tweetId) => tweetId !== "");

        const commentIds = likedPosts
          ?.map((likedPost) => likedPost.commentId)
          .filter((commentId) => commentId !== "");
        // console.log("PostIds: ", postIds, "CommentIds: ", commentIds);

        if (postIds.length !== 0) {
          setTweetIds(postIds);
        }

        if (commentIds.length !== 0) {
          setCommentIds(commentIds);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  function getFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (["mp4", "avi", "mov"].includes(extension)) {
      return "video";
    } else {
      return "";
    }
  }

  const getTweets = async () => {
    try {
      const tweetInfo = tweetIds?.map(async (id) => {
        const tweet = await appwriteService.getTweetById(id);
        // console.log("Tweet: ", tweet);
        return tweet;
      });

      const resolvedTweetInfo = await Promise.all(tweetInfo);
      // console.log("Resolved Tweet Info: ", resolvedTweetInfo);
      setTweets(resolvedTweetInfo);
    } catch (error) {
      throw error;
    }
  };

  const getComments = async () => {
    try {
      const commentInfo = commentIds?.map(async (id) => {
        const comment = appwriteService.getCommentDetails(id);
        return comment;
      });

      const resolvedCommentInfo = await Promise.all(commentInfo);

      setComments(resolvedCommentInfo);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getLikedPosts();
  }, [userData]); // Run once when userData changes

  useEffect(() => {
    if (tweetIds.length !== 0) {
      getTweets();
    }

    if (commentIds.length !== 0) {
      getComments();
    }
  }, [tweetIds, commentIds]); // Run when tweetIds change

  useEffect(() => {
    // console.log("Tweets", tweets, "Comments", comments);
  }, [tweets, comments]);

  return tweets.length !== 0 || comments.length !== 0 ? (
    <div>
      {/* handle top and middle of profile not changing problem */}
      {tweets?.map((tweet, index) => (
        <Tweet
          {...tweet}
          key={index}
          getFileType={getFileType}
          noSettings={true}
        />
      ))}

      {comments?.map((comment, index) => (
        <Tweet
          {...comment}
          key={index}
          noSettings={true}
          commentId={comment.$id}
        />
      ))}
    </div>
  ) : (
    <div className="text-center w-full text-2xl text-white dark:text-red-500 mb-4">
      <h1>No Likes added</h1>
    </div>
  );
}

export default Likes;
