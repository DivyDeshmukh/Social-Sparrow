// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import appwriteService from "../appwrite/config";
// import Tweet from "./Tweet";

// function Bookmarks() {
//   const userData = useSelector((state) => state.auth.userData);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [tweetDetails, setTweetDetails] = useState([]);
//   const [commentDetails, setCommentDetails] = useState([]);

//   const getBookmarks = async () => {
//     try {
//       const bookmarks = await appwriteService.getBookmarks(userData?.username);
//       console.log("Bookmarks: ", bookmarks);
//       if (bookmarks) {
//         setBookmarks(bookmarks);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const getTweetDetails = async () => {
//     try {
//       const promises = bookmarks?.map(async (bookmark) => {
//         if (bookmark.tweetId) {
//           return await appwriteService.getTweetById(bookmark.tweetId);
//         }
//       });

//       const tweetDetails = await Promise.all(promises);
//       console.log(tweetDetails);
//       if (tweetDetails.length) {
//         const tweets = tweetDetails?.filter(
//           (tweetDetail) => tweetDetail !== undefined
//         );
//         setTweetDetails(tweets);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const getCommentDetails = async () => {
//     try {
//       const promises = bookmarks?.map(async (bookmark) => {
//         if (bookmark.commentId) {
//           return await appwriteService.getCommentDetails(bookmark.commentId);
//         }
//       });

//       const commentDetails = await Promise.all(promises);
//       console.log(commentDetails);
//       if (commentDetails.length) {
//         const comments = commentDetails?.filter(
//           (commentDetail) => commentDetail !== undefined
//         );
//         setCommentDetails(comments);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   useEffect(() => {
//     getBookmarks();
//   }, [userData]);

//   useEffect(() => {
//     getTweetDetails();
//     getCommentDetails();
//   }, [bookmarks]);

//   useEffect(() => {
//     console.log(
//       "TweetDetails: ",
//       tweetDetails,
//       "CommentDetails: ",
//       commentDetails
//     );
//   }, [tweetDetails, commentDetails]);

//   return (
//     <div className="border-b-2 border-b-red-500 mb-16 pb-6 flex gap-8 px-40 mt-4 font-bold">
//       {tweetDetails.length !== 0 || commentDetails.length !== 0 ? (
//         <div id="content" className="w-[75%] border-2 border-red-600 pt-4">
//           {tweetDetails?.map((tweetDetail, index) => (
//             <Tweet {...tweetDetail} key={index} />
//           ))}
//           {commentDetails?.map((commentDetail, index) => (
//             <Tweet
//               {...commentDetail}
//               key={index}
//               commentId={commentDetail.$id}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="w-full text-center text-red-500 text-2xl">
//           <h1>No Bookmarks added</h1>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Bookmarks;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import Tweet from "./Tweet";

function Bookmarks() {
  const userData = useSelector((state) => state.auth.userData);
  const [bookmarks, setBookmarks] = useState([]);
  const [tweetDetails, setTweetDetails] = useState([]);
  const [commentDetails, setCommentDetails] = useState([]);

  const getBookmarks = async () => {
    try {
      const bookmarks = await appwriteService.getBookmarks(userData?.username);
      if (bookmarks) {
        setBookmarks(bookmarks);
      }
    } catch (error) {
      throw error;
    }
  };

  const getTweetDetails = async () => {
    try {
      const promises = bookmarks?.map(async (bookmark) => {
        if (bookmark.tweetId) {
          return await appwriteService.getTweetById(bookmark.tweetId);
        }
      });

      const tweetDetails = await Promise.all(promises);
      if (tweetDetails.length) {
        const tweets = tweetDetails?.filter(
          (tweetDetail) => tweetDetail !== undefined
        );
        setTweetDetails(tweets);
      }
    } catch (error) {
      throw error;
    }
  };

  const getCommentDetails = async () => {
    try {
      const promises = bookmarks?.map(async (bookmark) => {
        if (bookmark.commentId) {
          return await appwriteService.getCommentDetails(bookmark.commentId);
        }
      });

      const commentDetails = await Promise.all(promises);
      if (commentDetails.length) {
        const comments = commentDetails?.filter(
          (commentDetail) => commentDetail !== undefined
        );
        setCommentDetails(comments);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getBookmarks();
  }, [userData]);

  useEffect(() => {
    getTweetDetails();
    getCommentDetails();
  }, [bookmarks]);

  return (
    <div className=" mb-16 pb-6 px-4 md:px-40 mt-4 font-bold">
      {tweetDetails.length !== 0 || commentDetails.length !== 0 ? (
        <div
          id="content"
          className="w-full md:w-3/4 border-2 border-white dark:border-red-600 pt-4 mx-auto"
        >
          <div className="border-b-2 mb-4 border-b-white dark:border-b-red-500 p-2 pl-4 flex gap-2">
            <i className="ri-bookmark-line text-3xl text-white dark:text-red-500"></i>
            <h1 className="text-3xl text-white dark:text-red-500">Bookmarks</h1>
          </div>
          {tweetDetails?.map((tweetDetail, index) => (
            <Tweet {...tweetDetail} key={index} />
          ))}
          {commentDetails?.map((commentDetail, index) => (
            <Tweet
              {...commentDetail}
              key={index}
              commentId={commentDetail.$id}
            />
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-white dark:text-red-500 text-2xl">
          <h1>No Bookmarks added</h1>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
