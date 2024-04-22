import React, { useCallback, useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Settings from "./Settings";
import Button from "./Button";
import Features from "./Features";
import Overlay from "./Overlay";

function Tweet({
  $id,
  username,
  content,
  fileIdArr,
  noSettings,
  text,
  commentId,
  tweetId,
  $createdAt,
  overlay,
}) {
  const [profileImgSrc, setProfileImgSrc] = useState("");
  const [contentImgSrc, setContentImgSrc] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [interested, setInterested] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const date = new Date($createdAt);
  const done = `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getFullYear()}`;
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [src, setSrc] = useState("");
  // const userData = useSelector((state) => state.auth.userData); name will come from users db

  const getContentImage = useCallback(async () => {
    if (!fileIdArr) return;
    // try {
    //   const imageArr = fileIdArr?.map(async (fileId) => {
    //     return await appwriteService.getFile(fileId);
    //   });

    //   console.log(imageArr);

    //   if (imageArr) {
    //     setContentImgSrc(imageArr);
    //   }
    // } catch (error) {
    //   throw error;
    // }
    try {
      // Use Promise.all to await all promises concurrently
      const imageArr = await Promise.all(
        fileIdArr?.map(async (fileId) => {
          // apply check here for finding the type of file and then either call preview or view, to get the name of the file we can use getFile method
          const fileData = await appwriteService.getFileData(fileId);

          if (fileData) {
            if (getFileType(fileData.name) === "image") {
              return {
                type: "image",
                src: await appwriteService.getFilePreview(fileId),
                id: fileId,
              };
            } else {
              return {
                type: "video",
                src: await appwriteService.getFileView(fileId),
                id: fileId,
              };
            }
          }
        })
      );

      // console.log(imageArr);

      // Set contentImgSrc with the resolved image sources
      setContentImgSrc(imageArr);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [username, fileIdArr]);

  const getUserDetails = useCallback(async () => {
    try {
      const userData = await appwriteService.getUserDetails(username);
      // console.log(userData);
      if (userData) {
        setUserDetails(userData);
      }
    } catch (error) {
      throw error;
    }
  }, [username]);

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

  const getProfileImage = useCallback(async () => {
    try {
      const profile = await appwriteService.getProfileImage(
        userDetails?.user_profile_id
      );
      if (profile) setProfileImgSrc(profile.href);
    } catch (error) {
      throw error;
    }
  }, [userDetails, username]);

  useEffect(() => {
    getUserDetails();
    getContentImage();
    // call other functions from here
  }, [username, content, fileIdArr]);

  useEffect(() => {
    userDetails && getProfileImage();
    // console.log(userDetails);
  }, [userDetails]);

  useEffect(() => {
    // console.log(contentImgSrc);
  }, [contentImgSrc]);

  const interestedSetting = () => {
    setInterested(false);
  };
  // console.log("ID: ", $id);
  const undo = () => {
    setInterested(true);
  };

  const back = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    if (userData?.username === username) {
      setActiveUser(true);
    }
  }, [userData, userDetails]);

  useEffect(() => {
    // console.log("hidden: ", hidden);
  }, [hidden]);

  return interested ? (
    <div>
      <div
        className={`${!interested && "h-0"} ${
          hidden && "hidden"
        } flex flex-col gap-4 border-b-2 border-white dark:border-b-red-500 mb-4 pl-4 overflow-hidden transition-all relative duration-200`}
      >
        <div className="w-full md:w-fit">
          <Link
            to={`/profile/${userDetails?.username}`}
            id="top"
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <div
              id="profile"
              className="h-16 md:h-[40px] w-16 md:w-[40px] flex justify-center items-center mt-1 md:mt-0 ml-2"
            >
              <img
                src={profileImgSrc ? profileImgSrc : null}
                alt=""
                className="rounded-full object-cover h-full w-full"
              />
            </div>
            <div
              id="text"
              className="flex flex-col md:flex-row gap-2 md:gap-4 items-center"
            >
              <h1 className="text-lg md:text-xl">
                {userDetails && userDetails.name}
              </h1>
              <h1 className="text-lg md:text-xl">
                @{userDetails && userDetails.username}
              </h1>
              <h1 className="text-sm md:text-md text-slate-600">{done}</h1>
            </div>
          </Link>
        </div>

        <div
          onClick={() => {
            !overlay
              ? navigate(
                  commentId
                    ? `/comment/${tweetId}/${$id}`
                    : `/tweet/${username}/${$id}`
                )
              : null;
          }}
          id="content"
          className="flex flex-col gap-4 cursor-pointer"
        >
          <div id="text">
            <p className="ml-2">{content ? content : text}</p>
          </div>
          <div id="images">
            {
              contentImgSrc.length !== 0 && (
                <div
                  id="innerbox-images"
                  className="h-[180px] w-full px-1 relative rounded-xl mb-6 overflow-x-auto space-x-0"
                >
                  {contentImgSrc?.map((file, index) => (
                    <div
                      id="innerBox"
                      className={`relative ${
                        contentImgSrc.length === 1 ? "w-[100%]" : "w-[50%]"
                      } h-full inline-block`}
                      key={index}
                      onClick={() => {
                        setShowOverlay(true);
                        setSrc({
                          bucket: "tweet",
                          id: file.id,
                        });
                      }}
                    >
                      {
                        // taking time in loading async data use conditional rendering
                        file && file.type === "image" ? (
                          <img
                            src={file && file.src}
                            alt={file && file.src}
                            className="object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1"
                          />
                        ) : (
                          <video
                            src={file && file.src}
                            className="object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1"
                            autoPlay
                            muted
                            controls
                          />
                        )
                      }
                    </div>
                  ))}
                </div>
              )
              // we can apply getFilePreview in src directly and it will return url of the uploaded image
            }
          </div>
        </div>

        <div
          id="features"
          className="mb-4 flex items-center justify-center px-2 pr-4"
        >
          {commentId ? (
            <Features commentId={commentId} />
          ) : (
            <Features postId={$id} />
          )}
        </div>

        {!noSettings && (
          <div
            id="settings"
            className="absolute right-3 top-1 cursor-pointer p-1"
            onClick={() => setShowSettings((prev) => !prev)}
          >
            <i className="ri-settings-5-fill absolute right-2 top-[-9px] text-white "></i>
            {showSettings && (
              <Settings
                interestedSetting={interestedSetting}
                postId={$id}
                hidden={setHidden}
                activeUser={activeUser}
              />
            )}
          </div>
        )}
      </div>
      {showOverlay && <Overlay back={back} fileId={src} />}
    </div>
  ) : (
    <div className="flex w-full justify-between gap-4 border-b-2 border-b-slate-500 mb-4 pl-4 relative px-6 items-start mt-[-5px]">
      <h1>Thanks for the feedback</h1>
      <Button
        onClick={undo}
        className="mt-[-6px] bg-red-500 text-black font-bold rounded-full hover:bg-black hover:text-red-500 hover:border-2 hover:border-red-500"
      >
        Undo
      </Button>
    </div>
  );
}

export default Tweet;

// user details from username can be taken from Users collection
//

// The issue lies in how you're handling the promises returned by appwriteService.getFile(fileId) inside the map function. Even though you're using await inside the map function, it doesn't wait for each promise to resolve before moving to the next iteration. Instead, it creates an array of promises immediately, which is why you see an array of promises in imageArr when you log it.
