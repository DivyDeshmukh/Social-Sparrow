import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Tweet from "./Tweet";
import { useSelector } from "react-redux";
import config from "../config/config";
import InputEmoji from "react-input-emoji";
import Button from "./Button";
import Reply from "./Reply";

function Comment() {
  const { tweetId, id } = useParams();
  const [comment, setComment] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const [userDetails, setUserDetails] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [currentUserProfileSrc, setCurrentProfileSrc] = useState("");
  const [text, setText] = useState("");
  const ref = useRef(null);
  const [comments, setComments] = useState([]);

  const getProfileImage = useCallback(async () => {
    try {
      const profile = await appwriteService.getProfileImage(
        userDetails?.user_profile_id
      );
      // console.log(profile.href);
      setProfileSrc(profile.href);
    } catch (error) {
      throw error;
    }
  }, [userDetails]);
  // console.log("Comment");

  const getCurrentUserProfileImg = useCallback(async () => {
    console.log("getCurrentProfileImg", userData);
    try {
      const profile = await appwriteService.getProfileImage(
        userData?.user_profile_id
      );
      // console.log(profile.href);
      setCurrentProfileSrc(profile.href);
    } catch (error) {
      throw error;
    }
  }, [userData]);

  const uploadComment = useCallback(async () => {
    // console.log(text);
    if (text === "") {
      return;
    }

    try {
      const posted = await appwriteService.postComment({
        username: userData?.username,
        text,
        tweetId: tweetId,
        commentId: id,
      });
      if (posted) {
        getComments();
        setText("");
      }
    } catch (error) {
      throw error;
    }
  }, [text]);

  const getCommentDetails = async () => {
    try {
      const comment = await appwriteService.getCommentDetails(id);
      if (comment) {
        setComment(comment);
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserDetails = async () => {
    try {
      const user = await appwriteService.getUserDetails(comment?.username);
      if (user) {
        setUserDetails(user);
      }
    } catch (error) {
      throw error;
    }
  };

  const getComments = async () => {
    try {
      const comments = await appwriteService.getComments(id);
      setComments(comments);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCommentDetails();
    getComments();
    // console.log(id, tweetId);
  }, [id]);

  useEffect(() => {
    comment && getUserDetails();
    // console.log(comment, comments);
  }, [comment, comments]);

  useEffect(() => {
    if (!(userDetails?.username === userData?.username)) {
      getCurrentUserProfileImg();
    }
  }, [userData]);

  useEffect(() => {
    userDetails && getProfileImage();
  }, [userDetails]);

  return (
    <div className="border-b-2 border-white dark:border-b-red-500 mb-16 pb-6 flex flex-col md:flex-row gap-8 px-4 mt-4 font-bold">
      <div
        id="content"
        className="w-full md:w-3/4 border-2 border-white dark:border-red-500 pt-4"
      >
        <div id="tweet">
          {comment && (
            <Tweet
              {...comment}
              text={comment.text}
              commentId={id}
              tweetId={tweetId}
            />
          )}
        </div>
        <div id="comment-section" className="pb-4 flex flex-col gap-2">
          <h1 className="text-slate-400 pb-2 border-b-2 border-white dark:border-b-red-500 w-[91.75%] md:w-11/12 ml-12 pl-7">
            {comments.length}{" "}
            {comments.length !== 1 ? "Replies...." : "Reply...."}
          </h1>
          <div
            id="input-post"
            className="bg-[#ED729F] border-white dark:bg-black flex md:flex-row justify-between h-auto border-b-2  dark:border-b-red-500 pb-4"
          >
            <div
              id="left"
              className="w-[15%] mr-4 md:w-1/5 bg-[#ED729F] dark:bg-black flex justify-center items-center mt-2.5 ml-7"
            >
              <Link
                to={`/profile/${userData?.username}`}
                id="img"
                className="h-[40px] w-[40px] flex justify-center items-center"
              >
                <img
                  src={
                    currentUserProfileSrc
                      ? currentUserProfileSrc
                      : config.appwrite_default_profile_Id
                  }
                  alt=""
                  className="rounded-full object-cover h-full w-full"
                />
              </Link>
            </div>
            <div id="right" className="flex flex-col gap-2 w-full md:w-4/5">
              <div
                id="text"
                className="h-full bg-[ED729F] border-white dark:bg-black flex justify-start flex-col border-b-2  dark:border-b-red-500"
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
                        ? "bg-slate-700 text-black font-bold rounded-full px-2 py-1"
                        : "bg-white text-[#ED729F] hover:bg-[#ED729F] hover:border-white hover:text-[white] dark:bg-red-500 dark:text-black font-bold rounded-full px-2 py-1 dark:hover:bg-black hover:border-2 dark:hover:border-red-500 dark:hover:text-red-500"
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
            comments?.map((comment, index) => (
              <Reply
                {...comment}
                profileSrc={profileSrc}
                getComments={getComments}
                key={index}
                commentId={id}
              />
            ))
          ) : (
            <h1>Be the first one to reply</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
