import React, { useEffect, useState, useCallback } from "react";
import appwriteService from "../appwrite/config";
import Tweet from "./Tweet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function UserPosts({userPosts = []}) {
  // const userData = useSelector((state) => state.auth.userData);
  // const [activeUser, setActiveUser] = useState(false);
  // const { username } = useParams();
  // const [userDetails, setUserDetails] = useState(null);

  // const getUserDetails = useCallback(async () => {
  //   try {
  //     const userData = await appwriteService.getUserDetails(username);
  //     if (userData) {
  //       setUserDetails(userData);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }, [username]);

  // useEffect(() => {
  //   getUserDetails();
  //   if (userData?.username === username) {
  //     setActiveUser(true);
  //   }
  // }, [username]);

  // useEffect(() => {
  //   userDetails && getUserPosts();
  // }, [userData, userDetails]);

  return userPosts?.length !== 0 ? (
    <div>
      {userPosts
        ? userPosts.map((post, index) => <Tweet {...post} key={index} />)
        : null}
    </div>
  ) : (
    <div className="text-center w-full text-2xl text-white dark:text-red-500 mb-4">
      <h1>No Posts Uploaded</h1>
    </div>
  );
}

export default UserPosts;
