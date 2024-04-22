import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";

function Features({ postId, commentId }) {
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkedId, setBookmarkedId] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [numOfComments, setNumOfComments] = useState(0);

  const likePost = async () => {
    // const liked;    // You're right; const liked; doesn't assign any value to liked. However, initializing a constant variable without assigning a value to it (const liked;) is also invalid in JavaScript. Constants must be initialized with a value at the time of declaration.
    let liked;
    try {
      if (postId) {
        liked = await appwriteService.likePost({
          username: userData?.username,
          tweetId: postId,
          commentId: "",
        });
      }

      if (commentId) {
        // console.log(commentId);
        liked = await appwriteService.likePost({
          username: userData?.username,
          tweetId: "",
          commentId: commentId,
        });
      }

      // console.log(liked);

      if (liked) {
        setLikeId(liked.$id);
        setLiked(true);
        setNumOfLikes((prev) => prev + 1);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const removeLike = async () => {
    try {
      // console.log(likeId);
      const removed = await appwriteService.removeLike(likeId);
      if (removed) {
        setLikeId("");
        setLiked(false);
        setNumOfLikes((prev) => prev - 1);
      }
    } catch (error) {
      throw error;
    }
  };

  const getLikes = async () => {
    let likes;

    try {
      if (postId) {
        likes = await appwriteService.getTweetLikes(postId);
      }
      if (commentId) {
        likes = await appwriteService.getCommentLikes(commentId);
      }

      // console.log(likes);
      if (likes) {
        setNumOfLikes(likes.length);
        if (!likeId) {
          const isLiked = likes?.find(
            (like) => like.username === userData?.username
          );
          // console.log(isLiked);
          if (isLiked) {
            setLiked(true);
            setLikeId(isLiked.$id);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const getComments = async () => {
    let comments;
    try {
      if (postId) {
        comments = await appwriteService.getTweetComments(postId);
      }

      if (commentId) {
        comments = await appwriteService.getComments(commentId);
      }

      if (comments) {
        setNumOfComments(comments.length);
      }
    } catch (error) {
      throw error;
    }
  };

  const bookmarkPost = async () => {
    // console.log("postId: ", postId, "commentId: ", commentId);
    try {
      if (postId) {
        const bookmark = await appwriteService.bookmarkPost({
          tweetId: postId,
          commentId: "",
          username: userData?.username,
        });
        // console.log(bookmark);
        if (bookmark) {
          setBookmarked(true);
          setBookmarkedId(bookmark.$id);
        }
      }

      if (commentId) {
        const bookmark = await appwriteService.bookmarkPost({
          tweetId: "",
          commentId: commentId,
          username: userData?.username,
        });
        if (bookmark) {
          setBookmarked(true);
          setBookmarkedId(bookmark.$id);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const removeBookmark = async () => {
    try {
      const deleted = await appwriteService.deleteBookmark(bookmarkedId);
      // console.log(bookmarked);
      if (deleted) {
        setBookmarked(false);
        setBookmarkedId("");
      }
    } catch (error) {
      throw error;
    }
  };

  const getBookmarks = async () => {
    let bookmarks;
    try {
      if (postId) {
        bookmarks = await appwriteService.getBookmarksByTweetId(postId);
        // console.log("Bookmarks: ", bookmarks);
      }

      if (commentId) {
        bookmarks = await appwriteService.getBookmarksByCommentId(commentId);
        // console.log("Bookmarks: ", bookmarks);
      }

      if (bookmarks) {
        const isBookmarked = bookmarks?.find(
          (bookmark) => bookmark.username === userData?.username
        );
        // console.log(isBookmarked);
        if (isBookmarked) {
          setBookmarked(true);
          setBookmarkedId(isBookmarked.$id);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getLikes();
    getComments();
  }, [postId, userData, commentId]);

  useEffect(() => {
    getBookmarks();
    // console.log(postId, commentId);
  }, [postId, commentId]);

  return (
    <div className="flex gap-20 justify-center w-full">
      <button className="h-fit w-fit" onClick={liked ? removeLike : likePost}>
        {!liked ? (
          <i className="ri-heart-line text-white dark:text-white"></i>
        ) : (
          <i class="ri-heart-3-fill text-white dark:text-red-500 duration-100 transition-all"></i>
        )}{" "}
        <span className="text-white dark:text-red-500">{` ${numOfLikes}`}</span>
      </button>
      <button>
        <i class="ri-chat-1-line text-white dark:text-white"></i>{" "}
        <span className="text-white dark:text-red-500">{` ${numOfComments}`}</span>
      </button>
      <button onClick={bookmarked ? removeBookmark : bookmarkPost}>
        {bookmarked ? (
          <i className="ri-bookmark-fill text-white dark:text-red-500"></i>
        ) : (
          <i className="ri-bookmark-line  text-white dark:text-red-500"></i>
        )}
      </button>
    </div>
  );
}

export default Features;
