import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { useParams } from "react-router-dom";
import Tweet from "./Tweet";

function Replies() {
  const [tweetComments, setTweetComments] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);
  const { username } = useParams();

  const getReplies = async () => {
    try {
      const replies = await appwriteService.getCommentByUsername(username);
      if (replies) {
        const tcom = replies.filter(
          (reply) => reply.tweetId !== "" && reply.commentId === ""
        );
        const crep = replies.filter((reply) => reply.commentId !== "");
        console.log("tcom ", tcom, "crep ", crep);
        if (tcom.length !== 0) setTweetComments(tcom);
        if (crep.length !== 0) setCommentReplies(crep);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getReplies();
  }, [username]);

  useEffect(() => {
    console.log(tweetComments, commentReplies);
  }, [tweetComments, commentReplies]);

  return tweetComments.length !== 0 || commentReplies.length !== 0 ? (
    <div>
      {tweetComments?.map((reply, index) => (
        <Tweet {...reply} key={index} tweetId={reply.$id} noSettings={true} />
      ))}
      {commentReplies?.map((reply, index) => (
        <Tweet {...reply} key={index} commentId={reply.$id} noSettings={true} />
      ))}
    </div>
  ) : (
    <div className="text-center w-full text-2xl text-white dark:text-red-500 mb-4">
      <h1>No Replies added</h1>
    </div>
  );
}

export default Replies;
