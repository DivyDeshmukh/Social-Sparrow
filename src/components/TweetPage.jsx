

// // fetch tweet details from id and then pass to tweet

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Tweet from "./Tweet";
import { useSelector } from "react-redux";
import config from "../config/config";
import InputEmoji from "react-input-emoji";
import Button from "./Button";
import Reply from "./Reply";

function TweetPage() {
  const { id } = useParams();
  const [tweet, setTweet] = useState({});
  const userData = useSelector((state) => state.auth.userData);
  const ref = useRef(null);
  const [text, setText] = useState("");
  const [currentUserProfileSrc, setCurrentProfileSrc] = useState("");
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const getUserDetails = async () => {
    try {
      const user = await appwriteService.getUserDetails(tweet?.username);
      if (user) {
        setUserDetails(user);
      }
    } catch (error) {
      throw error;
    }
  };

  const getPostDetails = async () => {
    try {
      const tweet = await appwriteService.getTweetById(id);
      if (tweet) {
        setTweet(tweet);
      }
    } catch (error) {
      throw error;
    }
  };

  const getCurrentUserProfileImg = useCallback(async () => {
    try {
      const profile = await appwriteService.getProfileImage(
        userData ? userData.user_profile_id : config.appwrite_default_profile_Id
      );
      setCurrentProfileSrc(profile.href);
    } catch (error) {
      throw error;
    }
  }, [userData]);

  const uploadComment = useCallback(async () => {
    if (text === "") {
      return;
    }

    try {
      const posted = await appwriteService.postComment({
        username: userData?.username,
        text,
        tweetId: id,
        commentId: "",
      });
      if (posted) {
        getComments();
        setText("");
      }
    } catch (error) {
      throw error;
    }
  }, [text]);

  const getComments = async () => {
    try {
      const comments = await appwriteService.getTweetComments(id);
      setComments(comments);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getPostDetails();
    tweet && getUserDetails();
    getComments();
    if (!(userDetails?.username === userData?.username)) {
      getCurrentUserProfileImg();
    }
  }, [id, userData]);

  return (
    <div className="border-b-2 border-b-white dark:border-b-red-500 mb-16 pb-6 flex flex-col gap-4 md:flex-row md:gap-8 px-4 md:px-40 mt-4 font-bold">
      <div
        id="content"
        className="w-full md:w-[75%] border-2 border-white dark:border-red-500 pt-4"
      >
        <div id="tweet">
          <Tweet {...tweet} overlay={true} />
        </div>
        <div id="comment-section" className="pb-4 flex flex-col gap-2">
          <h1 className="text-slate-400 pb-2 border-b-2 border-b-white dark:border-b-red-500 w-[92.75%] md:w-[90%] ml-7 pl-7">
            {comments.length}{" "}
            {comments.length !== 1 ? "Replies...." : "Reply...."}
          </h1>
          <div
            id="input-post"
            className="dark:bg-black flex justify-between h-auto border-b-2 dark:border-b-red-500 pb-4"
          >
            <div id="left" className="w-[10%] dark:bg-black ">
              <Link
                to={`/profile/${userData?.username}`}
                id="img"
                className="h-[40px] w-[40px] flex justify-center items-center mt-2.5 ml-1"
              >
                <img
                  src={currentUserProfileSrc}
                  alt=""
                  className="rounded-full object-cover h-full w-full"
                />
              </Link>
            </div>
            <div id="right" className="flex flex-col gap-2 w-[85%]">
              <div
                id="text"
                className="h-full dark:bg-black flex justify-start flex-col border-b-2 dark:border-b-red-500"
              >
                <InputEmoji
                  height={40}
                  onChange={setText}
                  value={text}
                  color="white"
                  borderColor="black"
                  theme="dark"
                  placeholder="Reply..."
                  type="text"
                  background="black"
                  buttonRef={ref}
                  position="right"
                />
              </div>
              <div
                id="editor"
                className="flex items-center justify-between pl-4 w-full"
              >
                <div
                  id="icon"
                  className="flex items-center justify-start h-[40px] pl-4 w-full"
                >
                  <button ref={ref} className="ml-8"></button>
                </div>
                <div className="pr-6">
                  <Button
                    onClick={uploadComment}
                    disabled={text === "" ? true : false}
                    className={`${
                      text === ""
                        ? "bg-slate-700 text-black font-bold rounded-full px-2 py-2"
                        : "bg-[white] text-[#ED729F] hover:bg-[#ED729F] hover:border-white hover:text-white dark:bg-red-500 dark:text-black font-bold rounded-full px-2 py-2 dark:hover:bg-black dark:hover:text-red-500 hover:border-2 dark:hover:border-red-500"
                    }`}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="reply"
          className="my-4 flex flex-col items-center justify-center gap-6"
        >
          {comments.length !== 0 ? (
            comments?.map((comment) => (
              <Reply
                {...comment}
                tweetId={id}
                getComments={getComments}
                key={comment.$id}
              />
            ))
          ) : (
            <h1>Be the first one to reply</h1>
          )}
        </div>
      </div>
      {showOverlay && <Overlay />}
    </div>
  );
}

export default TweetPage;
