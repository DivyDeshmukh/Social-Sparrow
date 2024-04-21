import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "./Input";
import { Link } from "react-router-dom";
import InputEmoji from "react-input-emoji";
import Button from "./Button";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import Tweet from "./Tweet";
import {
  setTweets as updateTweets,
  setFollowingTweets,
} from "../store/tweetSlice";
import { useDispatch } from "react-redux";
import config from "../config/config";
import { setUserPosts } from "../store/tweetSlice";
import Search from "./Search";
import "../css/home.css";

function Home() {
  const ref = useRef(null);
  const ref2 = useRef(null);
  // const ref3 = useRef(null);
  const [text, setText] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [tweets, setTweets] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const allTweets = useSelector((state) => state.tweets.tweets);
  const specificTweets = useSelector((state) => state.tweets.followingTweets);
  const dispatch = useDispatch();
  const userposts = useSelector((state) => state.tweets.userPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const getProfileImage = useCallback(async () => {
    try {
      const profile = await appwriteService.getProfileImage(
        userData ? userData.user_profile_id : config.appwrite_default_profile_Id
      );
      // console.log(profile.href);
      setProfileSrc(profile.href);
    } catch (error) {
      throw error;
    }
  }, [userData]);

  const uploadImage = () => {
    // whenever user clicks on the button we will programmatically click on the file input
    ref2?.current.click();
  };

  function getFileType(fileName) {
    if (fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
        return "image";
      } else if (["mp4", "avi", "mov"].includes(extension)) {
        return "video";
      } else {
        return "";
      }
    }
  }

  const handleFileInputChange = async (e) => {
    // check if imgSrc is empty or not if not then first delete old file from database and then upload new
    // if (imgSrc) {
    //   await appwriteService.deleteFile(uploadedFile.$id);
    // }

    // take file from this e
    // upload file in bucket
    // show preview of file in the box
    const file = e.target.files[0];
    // first upload file to server then use its url to set that as image.
    // console.log(file);
    const fileType = getFileType(file.name);

    if (file) {
      // upload image
      const fileUploaded = await appwriteService.uploadTweetFile(file);
      if (fileUploaded) {
        if (fileType === "image") {
          const src = await appwriteService.getFilePreview(fileUploaded.$id);
          setUploadedFile((prev) => [
            ...prev,
            { fileId: fileUploaded.$id, src: src, type: fileType },
          ]);
        } else if (fileType === "video") {
          const src = await appwriteService.getFileView(fileUploaded.$id);
          setUploadedFile((prev) => [
            ...prev,
            { fileId: fileUploaded.$id, src: src, type: fileType },
          ]);
        }
        setUploadedFileIds((prev) => [...prev, fileUploaded.$id]);
      }
    }
  };

  const removePost = async (index) => {
    try {
      const deleted = await appwriteService.deleteFile(
        uploadedFile[index].fileId
      );

      if (deleted) {
        setUploadedFile((prev) => [
          ...prev.slice(0, index),
          ...prev.slice(index + 1, prev.length),
        ]);
      }
    } catch (error) {
      throw error;
    }
  };

  const uploadPost = useCallback(async () => {
    // console.log(text, "uploadedFileIds", uploadedFileIds.length, typeof uploadedFileIds);
    if (uploadedFileIds.length === 0 && text === "") {
      return;
    }

    try {
      const post = await appwriteService.tweets({
        username: userData?.username,
        content: text,
        fileIdArr: uploadedFileIds.length === 0 ? [] : uploadedFileIds,
      });

      if (post) {
        dispatch(setUserPosts([post, ...userposts]));
        // console.log(post, userposts);
        setText("");
        setUploadedFile([]);
        setUploadedFileIds([]);
      }
    } catch (error) {
      throw error;
    }
  }, [uploadedFile, text]);

  // useEffect(() => {
  //   if (imgSrc || text) {
  //     ref3.current.disabled = false;
  //   }
  // }, [imgSrc, text]);

  const getTweets = async () => {
    try {
      const docs = await appwriteService.getTweets();
      // console.log(docs);
      if (docs) {
        // setTweets(docs);
        // update store
        dispatch(updateTweets(docs));
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserTweets = async () => {
    try {
      const userposts = await appwriteService.getUserPosts(userData?.username);
      if (userposts) {
        dispatch(setUserPosts(userposts));
      }
    } catch (error) {
      throw error;
    }
  };

  const followingTweets = async () => {
    try {
      const promises = userData?.Following?.map(async (username) => {
        const tweetArr = await appwriteService.getTweetsByUsername(username);
        return tweetArr;
      });

      const resolvedPromises = await Promise.all(promises);
      const specificTweets = resolvedPromises.flat(Infinity);
      // setTweets(specificTweets.flat(Infinity));

      // console.log(specificTweets);
      if (specificTweets) {
        dispatch(setFollowingTweets(specificTweets));
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getProfileImage();
    getTweets();
    getUserTweets();
    userData?.Following && followingTweets();
    // console.log(userData);
    // console.log((userData?.user_profile_id));
  }, [userData]);

  useEffect(() => {
    // console.log( uploadedFile );
    // console.log(tweets);
    // console.log(text);
  }, [uploadedFile, tweets, text]);

  return (
    <div
      className="flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 pb-6 w-full h-full font-bold mb-12 mt-4"
      id="home"
    >
      <div
        id="content"
        className="w-full md:w-[75%] border-2 dark:border-red-500 border-white"
      >
        <nav className="border-b-2 dark:border-b-red-500 border-b-white flex w-full pb-4 justify-between gap-12 items-center px-8 py-2">
          <button
            onClick={() => setTweets(true)}
            className={
              tweets
                ? "dark:text-red-500 text-white"
                : "text-black dark:text-white"
            }
          >
            For you
          </button>
          <button
            onClick={() => setTweets(false)}
            className={
              !tweets
                ? "dark:text-red-500 text-white"
                : "text-black dark:text-white"
            }
          >
            Following
          </button>
        </nav>
        <div
          id="post"
          className="bg-[#ED729F] dark:bg-black flex justify-between h-auto border-b-2 dark:border-b-red-500 border-b-white"
        >
          <div
            id="left"
            className="mr-4 w-[15%] lg:w-1/5 bg-[#ED729F] dark:bg-black md:w-20 flex justify-center mt-2 min-w-[60px]"
          >
            <Link
              to={`/profile/${userData?.username}`}
              id="img"
              className="h-[45px] w-[45px] flex justify-center items-center mt-2.5 ml-[1rem] rounded-full"
            >
              <img
                src={profileSrc}
                alt=""
                className="rounded-full object-cover h-full w-full"
              />
            </Link>
          </div>
          <div
            id="right"
            className="flex flex-col gap-2 w-[90%] md:w-4/5 lg:w-4/5"
          >
            <div
              id="text"
              className="h-full bg-[#ED729F] dark:bg-black flex justify-start flex-col border-b-2 border-b-white dark:border-b-red-500 z-[1]"
            >
              {/* <textarea 
              placeholder='What is happening?!'
              type='text'
              style={{resize: 'none'}}
              className='h-full focus:outline-none w-full bg-black mt-4 ml-4'
              /> */}

              <InputEmoji
                // className='h-full focus:outline-none w-full bg-black mt-4 ml-4'
                height={2}
                onChange={setText}
                value={text}
                color="white"
                borderColor="black"
                theme="dark"
                placeholder="What is happening?!"
                type="text"
                background="black"
                buttonRef={ref}
                position="right"
              />

              {/* below block is for showing images */}
              {/* {
                ((imgSrc.length !== 0) || (videoSrc.length !== 0)) && (
                  <div className='h-[180px] w-full px-4 relative rounded-xl mb-6 overflow-x-auto gap-2'>
                    {
                      imgSrc.map((src, index) => (
                        <div id="innerBox" className={`relative ${uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"} h-full inline-block`} key={index}>
                          <img src={src} alt={src} className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1' />
                          <Button className='absolute top-2 right-2 bg-transparent hover:bg-slate-800' onClick={(e) => removePost(index)}>
                            <i className="ri-close-large-line"></i>
                          </Button>
                        </div>
                      ))
                    }

                    {
                      videoSrc.map((src, index) => (
                        <div id="innerBox" className={`relative ${uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"} h-full inline-block`} key={index}>
                          <video src={src} 
                          className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1'
                          autoPlay
                          muted
                          controls
                          />
                          <Button className='absolute top-2 right-2 bg-transparent hover:bg-slate-800' onClick={(e) => removePost(index)}>
                            <i className="ri-close-large-line"></i>
                          </Button>
                        </div>
                      ))
                    }

                  </div>
                )
                // we can apply getFilePreview in src directly and it will return url of the uploaded image
              } */}

              {uploadedFile.length !== 0 && (
                <div className="h-[180px] w-full px-4 relative rounded-xl mb-6 overflow-x-auto gap-2">
                  {uploadedFile.map((file, index) => (
                    <div
                      id="innerBox"
                      className={`relative ${
                        uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"
                      } h-full inline-block`}
                      key={index}
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.src}
                          alt={file.src}
                          className="object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1"
                        />
                      ) : (
                        <video
                          src={file.src}
                          className="object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1"
                          autoPlay
                          muted
                          controls
                        />
                      )}
                      <Button
                        className="absolute top-2 right-2 bg-transparent hover:bg-slate-800 mix-blend-difference"
                        onClick={(e) => removePost(index)}
                      >
                        <i className="ri-close-large-line text-white"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              id="editor"
              className="flex items-center justify-between pl-4 w-full"
            >
              <div
                id="icon"
                className="flex items-center justify-start h-[40px] pl-4 w-full"
              >
                <Input
                  type="file"
                  className="hidden"
                  // value={imgSrc}
                  onChange={handleFileInputChange}
                  ref={ref2}
                  disabled={uploadedFile.length === 4 ? true : false}
                />
                <button onClick={uploadImage}>
                  <i className="ri-image-line object-cover"></i>
                </button>
                <button ref={ref} className="ml-4"></button>
              </div>
              <div className="pr-6">
                <Button
                  onClick={uploadPost}
                  disabled={
                    text === "" && uploadedFile.length === 0 ? true : false
                  }
                  className={`rounded-xl ${
                    text === "" && uploadedFile.length === 0
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-black rounded-full hover:bg-black hover:text-slate-700"
                      : "dark:bg-red-500 dark:text-black dark:hover:bg-black dark:hover:text-red-500 hover:border-2 dark:hover:border-red-500 rounded-xl px-2 py-1 bg-white border-[#ED729F] hover:bg-[#ED729F] hover:border-white hover:text-white"
                  }`}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="tweets"
          className="mt-6 pt-6 border-t-2 border-white dark:border-red-500 mb-6 h-auto w-full"
        >
          <div className="border-b-2 border-b-white dark:border-b-red-500">
            {/* {console.log(tweets)} */}
            {tweets
              ? allTweets.map((tweet, index) => (
                  <Tweet {...tweet} key={index} />
                ))
              : specificTweets.map((tweet, index) => (
                  <Tweet {...tweet} key={index} />
                ))}
          </div>
        </div>
      </div>
      <div id="search" className="hidden md:block w-[25%]">
        <nav className="border-b-2 border-white  dark:border-red-500 flex w-full mb-8 pb-3 justify-between items-center py-1">
          <Input
            type="text"
            placeholder="🔍 Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border-2 border-white dark:border-red-500 px-4 text-white rounded-lg"
          />
        </nav>
        <div
          id="results"
          className="w-full h-auto bg-[#ED729F] dark:bg-red-500 shadow-md shadow-white rounded-md"
        >
          {searchTerm && <Search username={searchTerm} />}
        </div>
      </div>
    </div>
  );
}

export default Home;

//  When using setUploadedFile to update the state, React will not immediately update the state variable uploadedFile. Instead, it will schedule the update and apply it in the next render cycle. This means that accessing uploadedFile immediately after calling setUploadedFile may not reflect the updated state.

// To ensure that you're working with the updated state, you should either perform the necessary logic inside a useEffect hook after uploadedFile has been updated, or you can pass a callback function to setUploadedFile that operates on the previous state.

// getFileView for videos and returns url
