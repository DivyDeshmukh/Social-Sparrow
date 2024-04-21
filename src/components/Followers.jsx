import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { Link, useParams } from "react-router-dom";
import { login } from "../store/authSlice";

function Followers() {
  const userData = useSelector((state) => state.auth.userData);
  const [userDetails, setUserDetails] = useState([]);
  const [profileSrc, setProfileSrc] = useState([]);
  const dispatch = useDispatch();

  const getUserDetailsArr = async () => {
    if (userData.Followers.length === 0) {
      return;
    }

    try {
      const promises = userData?.Followers?.map(async (follower) => {
        return await appwriteService.getUserDetails(follower);
      });

      const userDetails = await Promise.all(promises);
      const updatedUserArr = userDetails?.map((user) => {
        user.isFollowed = userData.Following.includes(user.username);
        return user;
      });
      console.log(updatedUserArr);
      setUserDetails(updatedUserArr);
    } catch (error) {
      throw error;
    }
  };

  const getProfileSrc = async () => {
    if (userDetails.length === 0) {
      return;
    }

    try {
      const promises = userDetails?.map(
        async (userDetail) =>
          await appwriteService.getProfileImage(userDetail.user_profile_id)
      );

      const profileSrcArr = await Promise.all(promises);
      setProfileSrc(profileSrcArr);
    } catch (error) {
      throw error;
    }
  };

  const follow = async (user) => {
    // console.log("follow", followed);
    try {
      const updatedUserProfile = await appwriteService.updateUserProfile({
        userId: user?.$id,
        ...user,
        Followers: [...user.Followers, userData?.username],
      });
      const updatedFollowing = await appwriteService.updateUserProfile({
        userId: userData?.$id,
        ...userData,
        Following: [...userData?.Following, user.username],
      });

      if (updatedFollowing && updatedUserProfile) {
        // setFollowed(true);
        user.isFollowed = true;
        dispatch(login({ ...updatedFollowing }));
      }
    } catch (error) {
      throw error;
    }
  };

  const unfollow = async (user) => {
    // console.log("unfollow", followed);
    try {
      const followers = user?.Followers.filter(
        (follower) => follower !== userData?.username
      );

      const following = userData?.Following.filter(
        (following) => following !== user?.username
      );

      const updatedUserProfile = await appwriteService.updateUserProfile({
        userId: user?.$id,
        ...user,
        Followers: followers,
      });
      const updatedFollowing = await appwriteService.updateUserProfile({
        userId: userData?.$id,
        ...userData,
        Following: following,
      });

      if (updatedFollowing && updatedUserProfile) {
        // setFollowed(false);
        user.isFollowed = false;
        dispatch(login({ ...updatedFollowing }));
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    console.log(userData, userData?.Followers.length);
    userData?.Followers.length !== 0 && getUserDetailsArr();
  }, [userData]);

  useEffect(() => {
    // console.log(userDetails);
    userDetails.length !== 0 && getProfileSrc();
  }, [userDetails]);

  useEffect(() => {
    console.log(userData?.Following);
  }, [userData]);

  // useEffect(() => {
  //   // console.log(profileSrc);

  // }, [profileSrc]);

  return userData?.Followers.length !== 0 ? (
    <div
      className="flex flex-col sm:flex-row gap-8 px-6 sm:px-12 md:px-20 lg:px-40 mt-4 pb-6 w-full h-full font-bold mb-12"
      id="home"
    >
      <div
        id="content"
        className="w-full sm:w-[75%] border-2 border-red-500 flex flex-col gap-4 items-center justify-center"
      >
        <div className="border-b-2 border-b-red-500 w-full pl-4 pb-4">
          <h1 className="text-red-500 text-3xl pt-4">Followers</h1>
        </div>
        {userDetails?.map((user, index) => {
          return (
            <div
              className="h-auto w-full flex flex-col sm:flex-row justify-between p-4 border-b-2 border-b-red-500 items-center gap-2"
              key={index}
            >
              <Link
                to={`/profile/${user.username}`}
                id="info"
                className="flex gap-4 items-center"
              >
                <div
                  id="img"
                  className="h-[45px] w-[45px] sm:h-[60px] sm:w-[60px] rounded-full overflow-hidden"
                >
                  <img
                    src={profileSrc[index]}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <div id="text-info" className="flex flex-col gap-1">
                  <h4>{user.name}</h4>
                  <h4 className="text-sm text-red-500">@{user.username}</h4>
                </div>
              </Link>
              <div id="following">
                <button
                  className="bg-red-500 p-2 text-black rounded-full px-4 hover:text-red-500 hover:bg-black hover:border-2 hover:border-red-500"
                  onClick={() => {
                    user.isFollowed ? unfollow(user) : follow(user);
                  }}
                >
                  {user.isFollowed ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="text-center w-full text-2xl text-red-500 mb-4 font-semibold pt-4">
      <h1>No Followers</h1>
    </div>
  );
}

export default Followers;
