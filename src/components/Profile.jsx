// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import Button from "./Button";
// import EditProfile from "./EditProfile";
// import { useSelector } from "react-redux";
// import appwriteService from "../appwrite/config";
// import UserPosts from "./UserPosts";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../store/authSlice";
// import Media from "./Media";
// import Likes from "./Likes";
// import Replies from "./Replies";
// import Overlay from "./Overlay";

// function Profile() {
//   const [showModal, setShowModal] = useState(false);
//   const userData = useSelector((state) => state.auth.userData);
//   const [profileSrc, setProfileSrc] = useState("");
//   const [coverSrc, setCoverSrc] = useState("");
//   // const [postNum, setPostNum] = useState("");
//   const [showPosts, setShowPosts] = useState(true);
//   const [showMedia, setShowMedia] = useState(false);
//   const [showLikes, setShowLikes] = useState(false);
//   const [showReplies, setShowReplies] = useState(false);
//   const [activeUser, setActiveUser] = useState(false);
//   const { username } = useParams();
//   const [userDetails, setUserDetails] = useState(null);
//   const [followed, setFollowed] = useState(false);
//   const [fileId, setFileId] = useState("");
//   const dispatch = useDispatch();
//   const date = new Date(userDetails?.$createdAt);
//   const joined = `${date.toLocaleString("default", {
//     month: "short",
//   })} ${date.getFullYear()}`;
//   const userposts = useSelector((state) => state.tweets.userPosts);
//   const [showOverlay, setShowOverlay] = useState(false);

//   const back = () => {
//     setShowModal(false);
//     setShowOverlay(false);
//   };

//   const getUserDetails = useCallback(async () => {
//     try {
//       const userData = await appwriteService.getUserDetails(username);
//       // console.log(userData);
//       if (userData) {
//         setUserDetails(userData);
//       }
//     } catch (error) {
//       throw error;
//     }
//   }, [username]);

//   const getImages = useCallback(async () => {
//     try {
//       if (activeUser && userData?.user_profile_id) {
//         const profileImage = await appwriteService.getProfileImage(
//           userData.user_profile_id
//         );
//         setProfileSrc(profileImage);
//       }

//       if (!activeUser && userDetails?.user_profile_id) {
//         const profileImage = await appwriteService.getProfileImage(
//           userDetails.user_profile_id
//         );
//         setProfileSrc(profileImage);
//       }

//       if (activeUser && userData?.user_coverImage_id) {
//         const coverImage = await appwriteService.getCoverImage(
//           userData?.user_coverImage_id
//         );
//         setCoverSrc(coverImage);
//       }

//       if (!activeUser && userDetails?.user_coverImage_id) {
//         const coverImage = await appwriteService.getCoverImage(
//           userDetails?.user_coverImage_id
//         );
//         setCoverSrc(coverImage);
//       }
//     } catch (error) {
//       throw error;
//     }
//   }, [userData, userDetails]);

//   // const getNumOfPosts = useCallback(async () => {
//   //     try {
//   //         if (userData) {
//   //             const docs = await appwriteService.getUserPosts(activeUser ? userData?.username : userDetails?.username);
//   //         setPostNum(docs.length);
//   //         }
//   //     } catch (error) {
//   //         throw error;
//   //     }
//   // }, [userData, userDetails]);

//   const follow = async () => {
//     console.log("follow", followed);
//     try {
//       const updatedUserProfile = await appwriteService.updateUserProfile({
//         userId: userDetails?.$id,
//         ...userDetails,
//         Followers: [...userDetails.Followers, userData?.username],
//       });
//       const updatedFollowing = await appwriteService.updateUserProfile({
//         userId: userData?.$id,
//         ...userData,
//         Following: [...userData?.Following, username],
//       });

//       if (updatedFollowing && updatedUserProfile) {
//         setFollowed(true);
//         dispatch(login({ ...updatedFollowing }));
//         getUserDetails();
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const unfollow = async () => {
//     console.log("unfollow", followed);
//     try {
//       const followers = userDetails?.Followers.filter(
//         (follower) => follower !== userData?.username
//       );
//       const following = userData?.Following.filter(
//         (following) => following !== username
//       );
//       const updatedUserProfile = await appwriteService.updateUserProfile({
//         userId: userDetails?.$id,
//         ...userDetails,
//         Followers: followers,
//       });
//       const updatedFollowing = await appwriteService.updateUserProfile({
//         userId: userData?.$id,
//         ...userData,
//         Following: following,
//       });

//       if (updatedFollowing && updatedUserProfile) {
//         setFollowed(false);
//         dispatch(login({ ...updatedFollowing }));
//         getUserDetails();
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   useEffect(() => {
//     userDetails && getImages();
//     // userData && getNumOfPosts();
//     // console.log(userposts.length);
//     // getUserDetails();
//   }, [userData, userDetails, userposts]);

//   useEffect(() => {
//     getUserDetails();
//     // console.log(username);
//     if (userData.username === username) {
//       setActiveUser(true);
//     } else {
//       setActiveUser(false);
//     }
//     // console.log(userDetails, userData, userData.username === username);
//   }, [username]);

//   useEffect(() => {
//     // console.log(coverSrc, "ProfileSrc: ", profileSrc.name);
//   }, [coverSrc, profileSrc]);

//   useEffect(() => {
//     if (userData) {
//       const isFollowing = userData.Following.some((follower) => {
//         // console.log(follower, username, follower === username);
//         return follower === username;
//       });

//       if (isFollowing) {
//         setFollowed(true);
//       }
//     }
//   }, [userData, username]);

//   return (
//     <div className="flex gap-8 px-40 mt-4 pb-6 justify-start items-start">
//       <div
//         id="content"
//         className="w-[75%] border-2 border-red-600 z-0 overflow-hidden font-bold"
//       >
//         <div id="top" className="flex flex-col gap-1 pl-8 pt-4">
//           <h1>{activeUser ? userData?.name : userDetails?.name}</h1>
//           <h5 className="text-slate-500 text-[14px]">
//             {userposts.length} posts
//           </h5>
//         </div>

//         <div id="middle" className="relative w-full">
//           <div
//             id="part1"
//             className={`h-[180px] overflow-hidden w-full mt-2 mb-2 ${
//               coverSrc ? "bg-black" : "bg-slate-700"
//             }`}
//             onClick={() => {
//               setShowOverlay(true);
//               setFileId({
//                 id: userDetails?.user_coverImage_id,
//                 bucket: "coverImage",
//               });
//             }}
//           >
//             {coverSrc && (
//               <img
//                 src={coverSrc}
//                 alt=""
//                 className="h-full w-full object-contain"
//               />
//             )}
//           </div>

// {activeUser ? (
//   <button
//     className="bg-red-500 text-black py-2 px-4 rounded-full font-semibold absolute right-2 text-center mr-4 mt-1 hover:bg-black border-2 border-red-500 hover:text-red-500"
//     onClick={() => setShowModal(true)}
//   >
//     Edit Profile
//   </button>
// ) : (
//   <button
//     className="bg-red-500 text-black py-2 px-4 rounded-full font-semibold absolute right-2 text-center mr-4 hover:border-2 hover:border-red-500 mt-1 hover:bg-black hover:text-red-500"
//     onClick={followed ? unfollow : follow}
//   >
//     {followed ? "Unfollow" : "Follow"}
//   </button>
// )}

//           <div
//             id="profileImage"
//             className="absolute top-28 left-4 h-[15vh] w-auto bg-black p-1 rounded-full"
//             onClick={() => {
//               setShowOverlay(true);
//               setFileId({
//                 id: userDetails?.user_profile_id,
//                 bucket: "profile",
//               });
//             }}
//           >
//             {profileSrc && (
//               <img
//                 src={profileSrc}
//                 alt=""
//                 className="h-full w-full object-cover rounded-full"
//               />
//             )}
//           </div>

//           <div id="part3" className="mt-14 pl-8">
//             <div id="top" className="flex flex-col gap-2 mb-2">
//               <h1>{activeUser ? userData?.name : userDetails?.name}</h1>
//               <h4 className="text-slate-500">
//                 @{activeUser ? userData?.username : userDetails?.username}
//               </h4>
//             </div>
//             <div id="description" className="mb-1">
//               <h5>{activeUser ? userData?.bio : userDetails?.bio}</h5>
//             </div>
//             <div id="details" className="mt-2 flex gap-4 flex-col">
//               <div id="info" className="flex gap-4">
//                 {userData?.username === username ? (
//                   <Link to={`followers`}>
//                     {userDetails?.Followers.length}{" "}
//                     {userDetails?.Followers.length > 1
//                       ? "Followers"
//                       : "Follower"}
//                   </Link>
//                 ) : (
//                   <div>{userDetails?.Followers.length} Followers</div>
//                 )}
//                 {userData?.username === username ? (
//                   <Link to={`following`}>
//                     {userDetails?.Following.length} Following
//                   </Link>
//                 ) : (
//                   <div>{userDetails?.Following.length} Following</div>
//                 )}
//               </div>
//               <h5 className="mb-2 text-slate-600">Joined {joined}</h5>
//               <Link
//                 to={`${userDetails?.website}`}
//                 className="text-purple-500 font-light underline -translate-y-4"
//               >
//                 {userDetails?.website} <i class="ri-arrow-right-up-line"></i>
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div
//           id="bottom-section"
//           className="mt-4 pl-8 border-b-2 border-b-red-500 mb-6 pb-2 flex w-full justify-between pr-6"
//         >
//           <div id="posts">
//             <button
//               onClick={() => {
//                 setShowPosts(true);
//                 setShowMedia(false);
//                 setShowLikes(false);
//                 setShowReplies(false);
//               }}
//               className={`${showPosts && "text-red-600"}`}
//             >
//               Posts
//             </button>
//           </div>
//           <div id="media">
//             <button
//               onClick={() => {
//                 setShowMedia(true);
//                 setShowPosts(false);
//                 setShowLikes(false);
//                 setShowReplies(false);
//               }}
//               className={`${showMedia && "text-red-600"}`}
//             >
//               Media
//             </button>
//           </div>
//           <div id="likes">
//             <button
//               onClick={() => {
//                 setShowLikes(true);
//                 setShowMedia(false);
//                 setShowPosts(false);
//                 setShowReplies(false);
//               }}
//               className={`${showLikes && "text-red-600"}`}
//             >
//               Likes
//             </button>
//           </div>
//           <div id="replies">
//             <button
//               onClick={() => {
//                 setShowReplies(true);
//                 setShowLikes(false);
//                 setShowMedia(false);
//                 setShowPosts(false);
//               }}
//               className={`${showReplies && "text-red-600"}`}
//             >
//               Replies
//             </button>
//           </div>
//         </div>

//         <div id="profile-info">
//           {showPosts && <UserPosts />}
//           {showMedia && <Media username={username} />}
//           {showLikes && <Likes />}
//           {showReplies && <Replies />}
//         </div>
//       </div>
//       {showModal && <EditProfile back={back} />}
//       {showOverlay && <Overlay fileId={fileId} back={back} />}
//     </div>
//   );
// }

// export default Profile;

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import UserPosts from "./UserPosts";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Media from "./Media";
import Likes from "./Likes";
import Replies from "./Replies";
import Overlay from "./Overlay";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [profileSrc, setProfileSrc] = useState("");
  const [coverSrc, setCoverSrc] = useState("");
  const [showPosts, setShowPosts] = useState(true);
  const [showMedia, setShowMedia] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [fileId, setFileId] = useState("");
  const dispatch = useDispatch();
  const date = new Date(userDetails?.$createdAt);
  const joined = `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getFullYear()}`;
  const userposts = useSelector((state) => state.tweets.userPosts);
  const [showOverlay, setShowOverlay] = useState(false);

  const back = () => {
    setShowModal(false);
    setShowOverlay(false);
  };

  const getUserDetails = useCallback(async () => {
    try {
      const userData = await appwriteService.getUserDetails(username);
      if (userData) {
        setUserDetails(userData);
      }
    } catch (error) {
      throw error;
    }
  }, [username]);

  const getImages = useCallback(async () => {
    try {
      if (activeUser && userData?.user_profile_id) {
        const profileImage = await appwriteService.getProfileImage(
          userData.user_profile_id
        );
        setProfileSrc(profileImage);
      }

      if (!activeUser && userDetails?.user_profile_id) {
        const profileImage = await appwriteService.getProfileImage(
          userDetails.user_profile_id
        );
        setProfileSrc(profileImage);
      }

      if (activeUser && userData?.user_coverImage_id) {
        const coverImage = await appwriteService.getCoverImage(
          userData?.user_coverImage_id
        );
        setCoverSrc(coverImage);
      }

      if (!activeUser && userDetails?.user_coverImage_id) {
        const coverImage = await appwriteService.getCoverImage(
          userDetails?.user_coverImage_id
        );
        setCoverSrc(coverImage);
      }
    } catch (error) {
      throw error;
    }
  }, [userData, userDetails]);

  const follow = async () => {
    try {
      const updatedUserProfile = await appwriteService.updateUserProfile({
        userId: userDetails?.$id,
        ...userDetails,
        Followers: [...userDetails.Followers, userData?.username],
      });
      const updatedFollowing = await appwriteService.updateUserProfile({
        userId: userData?.$id,
        ...userData,
        Following: [...userData?.Following, username],
      });

      if (updatedFollowing && updatedUserProfile) {
        setFollowed(true);
        dispatch(login({ ...updatedFollowing }));
        getUserDetails();
      }
    } catch (error) {
      throw error;
    }
  };

  const unfollow = async () => {
    try {
      const followers = userDetails?.Followers.filter(
        (follower) => follower !== userData?.username
      );
      const following = userData?.Following.filter(
        (following) => following !== username
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
        setFollowed(false);
        dispatch(login({ ...updatedFollowing }));
        getUserDetails();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCoverSrc = (preview) => {
    setCoverSrc(preview);
  };

  const handleProfileSrc = (preview) => {
    setProfileSrc(preview);
  };

  useEffect(() => {
    userDetails && getImages();
  }, [userData, userDetails, userposts, showModal]);

  useEffect(() => {
    getUserDetails();
    if (userData.username === username) {
      setActiveUser(true);
    } else {
      setActiveUser(false);
    }
  }, [username]);

  useEffect(() => {
    if (userData) {
      const isFollowing = userData.Following.some(
        (follower) => follower === username
      );
      if (isFollowing) {
        setFollowed(true);
      }
    }
  }, [userData, username]);

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-12 mt-4 pb-6">
      <div className="lg:w-[75%] border-2 border-white dark:border-red-600 z-0 overflow-hidden font-bold">
        {/* Profile Header */}
        <div className="flex flex-col gap-1 pl-8 pt-4">
          <h1>{activeUser ? userData?.name : userDetails?.name}</h1>
          <h5 className="text-slate-500 text-[14px]">
            {userposts.length} posts
          </h5>
        </div>

        {/* Profile Cover */}
        <div
          className={`h-[180px] overflow-hidden w-full mt-2 mb-2 ${
            coverSrc ? "bg-black" : "bg-slate-700"
          }`}
          onClick={() => {
            setShowOverlay(true);
            setFileId({
              id: userDetails?.user_coverImage_id,
              bucket: "coverImage",
            });
          }}
        >
          {coverSrc && (
            <img
              src={coverSrc}
              alt=""
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {activeUser ? (
          <button
            className="bg-[white] text-[#ED729F] dark:bg-red-500  dark:text-black py-2 px-4 rounded-full font-semibold absolute left-[63.5%] -translate-x-1 sm:left-[80%] md:left-[82.75%] md:-translate-x-2 lg:left-[61.5%] xl:left-[64%] -translate-y-1 text-center mr-4 mt-1 dark:hover:bg-black hover:bg-[#ED729F] hover:text-[white] border-2 dark:border-red-500 dark:hover:text-red-500"
            onClick={() => setShowModal(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="bg-[#ED729F] text-white dark:bg-red-500 dark:text-black py-2 px-4 rounded-full font-semibold absolute left-[60%] lg:left-[65%] -translate-y-1 text-center mr-4 hover:border-2 hover:border-red-500 mt-1 hover:bg-black hover:text-red-500"
            onClick={followed ? unfollow : follow}
          >
            {followed ? "Unfollow" : "Follow"}
          </button>
        )}

        {/* Profile Image */}
        <div
          className="absolute top-72 translate-y-1 md:translate-y-0 lg:left-20 left-8 h-[12.5vh] w-auto bg-[black] dark:bg-black p-1 rounded-full"
          onClick={() => {
            setShowOverlay(true);
            setFileId({ id: userDetails?.user_profile_id, bucket: "profile" });
          }}
        >
          {profileSrc && (
            <img
              src={profileSrc}
              alt=""
              className="h-full w-full object-cover rounded-full"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="mt-16 pl-8">
          <div className="flex flex-col gap-2 mb-2">
            <h1>{activeUser ? userData?.name : userDetails?.name}</h1>
            <h4 className="text-slate-500">
              @{activeUser ? userData?.username : userDetails?.username}
            </h4>
          </div>
          <div className="mb-1">
            <h5>{activeUser ? userData?.bio : userDetails?.bio}</h5>
          </div>
          <div className="mt-2 flex gap-4 flex-col">
            {activeUser ? (
              <div className="flex gap-4">
                <Link to={`followers`}>
                  {userDetails?.Followers.length}{" "}
                  {userDetails?.Followers.length > 1 ? "Followers" : "Follower"}
                </Link>
                <Link to={`following`}>
                  {userDetails?.Following.length} Following
                </Link>
              </div>
            ) : (
              <div className="flex gap-4">
                <div>
                  {userDetails?.Followers.length}{" "}
                  {userDetails?.Followers.length > 1 ? "Followers" : "Follower"}
                </div>
                <div>{userDetails?.Following.length} Following</div>
              </div>
            )}
            <h5 className="mb-2 text-slate-600">Joined {joined}</h5>
            {userDetails?.website !== null && (
              <Link
                to={`${userDetails?.website}`}
                className="text-white dark:text-purple-500 font-light underline -translate-y-4 -translate-x-5"
              >
                {userDetails?.website}{" "}
                <i className="ri-arrow-right-up-line"></i>
              </Link>
            )}
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="mt-4 pl-8 border-b-2 border-white dark:border-b-red-500 mb-6 pb-2 flex w-full justify-between pr-6">
          <button
            onClick={() => {
              setShowPosts(true);
              setShowMedia(false);
              setShowLikes(false);
              setShowReplies(false);
            }}
            className={`${showPosts && "text-white dark:text-red-600"}`}
          >
            Posts
          </button>
          <button
            onClick={() => {
              setShowMedia(true);
              setShowPosts(false);
              setShowLikes(false);
              setShowReplies(false);
            }}
            className={`${showMedia && "text-white dark:text-red-600"}`}
          >
            Media
          </button>
          <button
            onClick={() => {
              setShowLikes(true);
              setShowMedia(false);
              setShowPosts(false);
              setShowReplies(false);
            }}
            className={`${showLikes && "text-white dark:text-red-600"}`}
          >
            Likes
          </button>
          <button
            onClick={() => {
              setShowReplies(true);
              setShowLikes(false);
              setShowMedia(false);
              setShowPosts(false);
            }}
            className={`${showReplies && "text-white dark:text-red-600"}`}
          >
            Replies
          </button>
        </div>

        {/* Profile Content */}
        <div id="profile-info">
          {showPosts && <UserPosts />}
          {showMedia && <Media username={username} />}
          {showLikes && <Likes />}
          {showReplies && <Replies />}
        </div>
      </div>
      {showModal && (
        <EditProfile
          back={back}
          handleCoverSrc={handleCoverSrc}
          handleProfileSrc={handleProfileSrc}
        />
      )}
      {showOverlay && <Overlay fileId={fileId} back={back} />}
    </div>
  );
}

export default Profile;
