import React, { useEffect, useState, useCallback } from "react";
import Features from "./Features";
import appwriteService from "../appwrite/config";
import Settings from "./Settings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Reply({ $id, username, text, getComments, tweetId, commentId }) {
  const [userDetails, setUserDetails] = useState({});
  const date = new Date(userDetails?.$createdAt);
  const joined = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
  const [showSettings, setShowSettings] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [profileSrc, setProfileSrc] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [hidden, setHidden] = useState(false);

  // console.log("Reply: ", $id, username, text);

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

  const getUserDetails = async () => {
    try {
      const user = await appwriteService.getUserDetails(username);
      if (user) {
        setUserDetails(user);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    username && getUserDetails();
  }, [username]);

  useEffect(() => {
    if (userData?.username === username) {
      setActiveUser(true);
    }
  }, [userData, username]);
  // console.log(userDetails);

  useEffect(() => {
    userDetails && getProfileImage();
  }, [userDetails]);

  return (
    <div
      className={`flex flex-col w-full px-8 relative border-b-2 border-b-white dark:border-b-red-500 pb-4 ${
        hidden && "hidden"
      }`}
    >
      <Link
        to={`/profile/${username}`}
        id="top"
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        <div
          id="profileImage"
          className="h-[40px] w-[40px] flex justify-center items-center overflow-hidden rounded-full"
        >
          <img
            src={profileSrc}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <h3 className="mb-2 md:mb-0">{userDetails?.name}</h3>
          <h3 className="md:ml-2">@{username}</h3>
        </div>
        <h4 className="text-slate-600 md:ml-2">{joined}</h4>
      </Link>
      <Link to={`/comment/${tweetId}/${$id}`} id="middle" className="mt-5 mb-4">
        <p>{text}</p>
      </Link>
      <div id="features">
        <Features commentId={$id} />
      </div>

      <div id="settings" className="absolute right-3 top-1 cursor-pointer p-1">
        <i className="ri-settings-5-fill text-white absolute right-2 top-[-22px]"></i>
        {showSettings && (
          <Settings
            commentId={$id}
            activeUser={activeUser}
            getComments={getComments}
            hidden={setHidden}
          />
        )}
      </div>
    </div>
  );
}

export default Reply;
