import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { login } from "../store/authSlice";

function Settings({
  interestedSetting,
  postId,
  hidden,
  activeUser,
  commentId,
  getComments,
}) {
  // const [activeUser, setActiveUser] = useState(false);
  // const {username} = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const [tweet, settweet] = useState("");
  const [comment, setComment] = useState("");
  const [follower, setFollower] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const [userDetails, setUserDetails] = useState({});
  const dispatch = useDispatch();

  // console.log("ID: ", postId);

  const getPostDetails = async () => {
    try {
      const tweetDetails = await appwriteService.getTweetById(postId);
      if (tweetDetails) {
        settweet(tweetDetails);
      }
    } catch (error) {
      throw error;
    }
  };

  const getCommentDetails = async () => {
    try {
      const comment = await appwriteService.getCommentDetails(commentId);
      if (comment) {
        setComment(comment);
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserDetails = useCallback(async () => {
    try {
      const userData = await appwriteService.getUserDetails(
        postId ? tweet?.username : comment?.username
      );
      // console.log(userData);
      if (userData) {
        setUserDetails(userData);
      }
    } catch (error) {
      throw error;
    }
  }, [tweet?.username]);

  const deletePost = async () => {
    // console.log("in", postId);
    try {
      // const promises = tweet?.fileIdArr?.map(async (fileId) => (
      //   await appwriteService.deleteFile(fileId)
      // ));

      // const deleted = Promise.all(promises);
      // console.log(deleted);
      // if (deleted) {
      //   const likeDeleted = await appwriteService.removeLike(tweet?.$id);
      //   // as, we have two attributes in Comments tweetId and commentId now, for comments of comments we have attached tweeetId with them as well and for normal tweet comments we have just attached tweetId and commentId is empty.
      //   const commentDeleted = await appwriteService.deleteComment(tweet?.$id);

      //   if (likeDeleted && commentDeleted) {
      //     const deleted = await appwriteService.deleteTweet(postId);
      //     hidden(true);
      //   }
      // }

      const deleted = await appwriteService.deleteTweet(postId);
      if (deleted) hidden(true);
    } catch (error) {
      throw error;
    }
  };

  const deleteComment = async () => {
    try {
      const deleted = await appwriteService.deleteComment(commentId);
      if (deleted) {
        hidden(true);
        getComments();
      }
    } catch (error) {
      throw error;
    }
  };

  const follow = async () => {
    // console.log("follow", follower);
    try {
      const updatedUserProfile = await appwriteService.updateUserProfile({
        userId: userDetails?.$id,
        ...userDetails,
        Followers: [...userDetails?.Followers, userData?.username],
      });
      const updatedFollowing = await appwriteService.updateUserProfile({
        userId: userData?.$id,
        ...userData,
        Following: [...userData?.Following, userDetails?.username],
      });

      if (updatedFollowing && updatedUserProfile) {
        setFollower(true);
        dispatch(login({ ...updatedFollowing }));
        // getUserDetails();
      }
    } catch (error) {
      throw error;
    }
  };

  const unfollow = async () => {
    // console.log("unfollow", follower);
    try {
      const followers = userDetails?.Followers.filter(
        (follower) => follower !== userData?.username
      );
      const following = userData?.Following.filter(
        (following) => following !== userDetails?.username
      );
      const updatedUserProfile = await appwriteService.updateUserProfile({
        userId: userDetails?.$id,
        ...userDetails,
        Followers: followers,
      });
      const updatedFollowing = await appwriteService.updateUserProfile({
        userId: userData?.$id,
        ...userData,
        Following: following,
      });

      if (updatedFollowing && updatedUserProfile) {
        setFollower(false);
        dispatch(login({ ...updatedFollowing }));
        // getUserDetails();
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    postId && getPostDetails();
    commentId && getCommentDetails();
  }, [postId, commentId]);

  useEffect(() => {
    if (userData) {
      const isFollowing = userData?.Following?.some((follower) => {
        // console.log(userDetails?.username);
        return follower === (postId ? tweet?.username : comment?.username);
      });

      // console.log("isFollowing: ", isFollowing);
      if (isFollowing) {
        setFollower(true);
      } else {
        setFollower(false);
      }
    }
  }, [userDetails, userData, tweet, comment]);

  useEffect(() => {
    getUserDetails();
  }, [tweet, comment, userData]);

  useEffect(() => {
    // console.log(userDetails);
  }, [userDetails]);

  // useEffect(() => {
  //   follow();
  //   unfollow();
  // }, [userDetails]);

  return (
    <div className="bg-white dark:bg-black p-2 flex flex-col gap-2 items-start justify-center shadow-md shadow-white mt-3 border-[1.5px] text-[#ED729F] dark:text-white dark:border-slate-600">
      {/* {
          (currentPath.split('/')[1] === 'home') ? <button onClick={interestedSetting}>😒 Not Interested</button> : null 
        }
        {
          (!activeUser) && <button className={`${follower ? 'text-white' : ''}`} onClick={follower ? unfollow : follow}>👤 {follower ? "Unfollow" : "Follow"}</button>
        }
        {
          (!activeUser) && <button>❌ Block</button>
        }
        {
          (activeUser) && <button className='flex justify-start gap-1' onClick={deletePost}>
            <i className="ri-delete-bin-4-line"></i> <h5>Delete</h5>
          </button>
        } */}

      {activeUser && (
        <button
          className="flex justify-start gap-1"
          onClick={postId ? deletePost : deleteComment}
        >
          <i className="ri-delete-bin-4-line text-[#ED729F] dark:text-white"></i>{" "}
          <h5 className="text-[#ED729F] dark:text-white">Delete</h5>
        </button>
      )}

      {!activeUser &&
        typeof follower === "boolean" &&
        (currentPath.split("/")[1] === "home" ? (
          <>
            <button onClick={interestedSetting}>😒 Not Interested</button>
            <button
              className={`${
                typeof follower === "boolean"
                  ? "text-[#ED729F] dark:text-white"
                  : "hidden"
              }`}
              onClick={follower ? unfollow : follow}
            >
              👤 {follower ? "Unfollow" : "Follow"}
            </button>
            <button>❌ Block</button>
          </>
        ) : (
          <>
            <button
              className={`${
                typeof follower === "boolean"
                  ? "text-[#ED729F] dark:text-white"
                  : "hidden"
              }`}
              onClick={follower ? unfollow : follow}
            >
              👤 {follower ? "Unfollow" : "Follow"}
            </button>
            <button>❌ Block</button>
          </>
        ))}
    </div>
  );
}

export default Settings;
