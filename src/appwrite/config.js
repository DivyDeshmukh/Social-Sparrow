import config from "../config/config";
import { Client, Databases, Storage, ID, Query } from "appwrite";

class AppwriteService {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(config.appwrite_url)
      .setProject(config.appwrite_project_Id);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async tweets({ username, content, fileIdArr }) {
    // console.log(fileIdArr);
    try {
      const tweets = await this.databases.createDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        ID.unique(),
        {
          username,
          content,
          fileIdArr,
        }
      );

      return tweets;
    } catch (error) {
      console.log("Appwrite Service :: tweets :: Error: ", error);
    }
  }

  async getTweets() {
    try {
      const tweets = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        [Query.orderDesc("$createdAt")]
      );

      if (tweets) return tweets.documents;

      console.log("tweets");
    } catch (error) {
      console.log("Appwrite Service :: getTweets :: Error: ", error);
    }
  }

  async getTweetsByUsername(username) {
    try {
      const tweetArr = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        [Query.equal("username", username)]
      );
      // console.log("specific tweets");
      return tweetArr.documents;
    } catch (error) {
      console.log("Appwrite Service :: getTweetsByUsername :: Error: ", error);
    }
  }

  async getTweetById(tweetId) {
    try {
      const tweet = await this.databases.getDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        tweetId
      );
      return tweet;
    } catch (error) {
      console.log("Appwrite Service :: getTweetById :: Error: ", error);
    }
  }

  async getUserDetails(username) {
    try {
      const userDetails = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        [Query.equal("username", username)]
      );
      // console.log(userDetails);
      return userDetails.documents[0];
    } catch (error) {
      console.log("Appwrite Service :: getUserDetails :: Error: ", error);
    }
  }

  async getUserDetailsById(userId) {
    try {
      const userData = await this.databases.getDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        userId
      );
      if (userData) return userData;
    } catch (error) {
      console.log("Appwrite Service :: getUserDetailsById :: Error: ", error);
    }
  }

  async checkUsernameAvaialable(username) {
    try {
      const usernameDoc = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        [Query.equal("username", username)]
      );
      console.log(usernameDoc, usernameDoc.documents);
      return usernameDoc.documents;
    } catch (error) {
      console.log(
        "Appwrite Service :: checkUsernameAvaialable :: Error: ",
        error
      );
    }
  }

  async getUserPosts(username) {
    try {
      const tweets = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        [Query.equal("username", username), Query.orderDesc("$createdAt")]
      );
      return tweets.documents;
    } catch (error) {
      console.log("Appwrite Service :: getUserPosts :: Error: ", error);
    }
  }

  async userProfile({
    userId,
    email,
    username,
    user_profile_id,
    user_coverImage_id,
    name,
    bio,
    date,
    website,
    Followers,
    Following,
    theme = "dark",
  }) {
    try {
      const profile = await this.databases.createDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        userId,
        {
          username,
          user_profile_id,
          user_coverImage_id,
          name,
          email,
          bio,
          date,
          website,
          Followers,
          Following,
          theme,
        }
      );
      return profile;
    } catch (error) {
      console.log("Appwrite Service :: userProfile :: Error: ", error);
    }
  }

  async updateUserProfile({
    userId,
    email,
    username,
    user_profile_id,
    name,
    user_coverImage_id,
    bio,
    date,
    website,
    Followers,
    Following,
    theme = "dark",
  }) {
    console.log("Followers: ", Followers, "Following: ", Following);
    try {
      const updatedProfile = await this.databases.updateDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        userId,
        {
          username,
          name,
          email,
          user_profile_id,
          user_coverImage_id,
          date,
          website,
          bio,
          Followers,
          Following,
          theme,
        }
      );
      console.log(updatedProfile);
      if (updatedProfile) return updatedProfile;
    } catch (error) {
      console.log("Appwrite Service :: updateUserProfile :: Error: ", error);
    }
  }

  async uploadTweetFile(file) {
    console.log(file);
    try {
      const fileUploaded = await this.storage.createFile(
        config.appwrite_bucket_tweets_Id,
        ID.unique(),
        file
      );

      return fileUploaded;
    } catch (error) {
      console.log("Appwrite Service :: uploadFile :: Error: ", error);
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(
        config.appwrite_bucket_tweets_Id,
        fileId
      );
    } catch (error) {
      console.log("Appwrite Service :: deleteFile :: Error: ", error);
    }
  }

  async deleteTweet(postId) {
    console.log(postId);
    try {
      await this.databases.deleteDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        postId
      );
    } catch (error) {
      console.log("Appwrite Service :: deleteTweet :: Error: ", error);
    }
  }

  // for tweet image
  async getFilePreview(fileId) {
    const file = await this.storage.getFilePreview(
      config.appwrite_bucket_tweets_Id,
      fileId
    );

    return file;
  }

  // for tweet videos
  async getFileView(fileId) {
    try {
      const file = await this.storage.getFileView(
        config.appwrite_bucket_tweets_Id,
        fileId
      );
      return file;
    } catch (error) {
      console.log("Appwrite Service :: getFileView :: Error: ", error);
    }
  }

  async getFileData(fileId) {
    try {
      const file = await this.storage.getFile(
        config.appwrite_bucket_tweets_Id,
        fileId
      );
      return file;
    } catch (error) {
      console.log("Appwrite Service :: getFileData :: Error: ", error);
    }
  }

  async uploadProfileImage(file) {
    try {
      const uploadedFile = await this.storage.createFile(
        config.appwrite_bucket_profile_Id,
        ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.log("Appwrite Service :: uploadProfileImage :: Error: ", error);
    }
  }

  async getProfileFileData(fileId) {
    try {
      const file = await this.storage.getFile(
        config.appwrite_bucket_profile_Id,
        fileId
      );
      return file;
    } catch (error) {
      console.log("Appwrite Service :: getProfileFileData :: Error: ", error);
    }
  }

  async getProfileImage(fileId) {
    console.log("Profile Image: ", fileId);
    const profile = this.storage.getFilePreview(
      config.appwrite_bucket_profile_Id,
      fileId
    );

    return profile;
  }

  async deleteProfileImage(fileId) {
    try {
      return await this.storage.deleteFile(
        config.appwrite_bucket_profile_Id,
        fileId
      );
    } catch (error) {
      console.log("Appwrite Service :: deleteProfileImage :: Error: ", error);
    }
  }

  async uploadCoverImage(file) {
    try {
      return await this.storage.createFile(
        config.appwrite_bucket_cover_image_Id,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite Service :: uploadCoverImage :: Error: ", error);
    }
  }

  async getCoverImage(fileId) {
    const coverImage = await this.storage.getFilePreview(
      config.appwrite_bucket_cover_image_Id,
      fileId
    );
    return coverImage;
  }

  async getCoverFileData(fileId) {
    try {
      const file = await this.storage.getFile(
        config.appwrite_bucket_cover_image_Id,
        fileId
      );
      return file;
    } catch (error) {
      console.log("Appwrite Service :: getProfileFileData :: Error: ", error);
    }
  }

  async deleteCoverImageFile(fileId) {
    try {
      return await this.storage.deleteFile(
        config.appwrite_bucket_cover_image_Id,
        fileId
      );
    } catch (error) {
      console.log("Appwrite Service :: deleteFile :: Error: ", error);
    }
  }

  async getAllMediaFileIds(username) {
    try {
      const tweets = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_tweets_Id,
        [Query.equal("username", username)]
      );
      const fileIDArr = tweets?.documents.map((tweet) => tweet.fileIdArr);
      console.log(fileIDArr, fileIDArr.flat(Infinity));

      return fileIDArr.flat(Infinity);
    } catch (error) {
      console.log("Appwrite Service :: getAllMediaFileIds :: Error: ", error);
    }
  }

  async likePost({ tweetId, commentId, username }) {
    try {
      const liked = await this.databases.createDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_likes_Id,
        ID.unique(),
        {
          tweetId,
          commentId,
          username,
        }
      );
      return liked;
    } catch (error) {
      console.log("Appwrite Service :: likePost :: Error: ", error);
    }
  }

  async removeLike(likeId) {
    try {
      const deleted = await this.databases.deleteDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_likes_Id,
        likeId
      );
      return deleted;
    } catch (error) {
      console.log("Appwrite Service :: removeLike :: Error: ", error);
    }
  }

  async getTweetLikes(tweetId) {
    console.log(tweetId);
    try {
      const likes = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_likes_Id,
        [Query.equal("tweetId", tweetId)]
      );

      return likes.documents;
    } catch (error) {
      console.log("Appwrite Service :: getTweetLikes :: Error: ", error);
    }
  }

  async getCommentLikes(commentId) {
    try {
      const likes = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_likes_Id,
        [Query.equal("commentId", commentId)]
      );

      return likes.documents;
    } catch (error) {
      console.log("Appwrite Service :: getCommentLikes :: Error: ", error);
    }
  }

  async getLikedPostsByUser(username) {
    try {
      const likedPosts = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_likes_Id,
        [Query.equal("username", username)]
      );

      if (likedPosts) {
        return likedPosts.documents;
      }
    } catch (error) {
      console.log("Appwrite Service :: getLikedPostsByUser :: Error: ", error);
    }
  }

  async postComment({ username, text, tweetId, commentId = "" }) {
    try {
      const comment = await this.databases.createDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        ID.unique(),
        {
          username,
          text,
          tweetId,
          commentId,
        }
      );

      return comment;
    } catch (error) {
      console.log("Appwrite Service :: postComment :: Error: ", error);
    }
  }

  async getCommentDetails(commentId) {
    try {
      const comment = await this.databases.getDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        commentId
      );
      if (comment) {
        return comment;
      }
    } catch (error) {
      console.log("Appwrite Service :: getCommentDetails :: Error: ", error);
    }
  }

  // When using object destructuring in a function parameter, you can indeed assign default values to the properties of the object by using the equals sign (=). This allows you to provide fallback values for properties if they are not provided when calling the function or if they are undefined.
  // async getComments (tweetId, commentId) {
  //     console.log(tweetId, commentId);
  //     let equalQuery;

  //     if (tweetId) {
  //         equalQuery = Query.equal("tweetId", tweetId);
  //     } else if (commentId) {
  //         equalQuery = Query.equal("commentId", commentId);
  //     }
  //     console.log(equalQuery);
  //     const query = [
  //         equalQuery,
  //         Query.orderDesc("$createdAt")
  //     ];

  //     console.log(query);

  //     try {
  //         const comments = await this.databases.listDocuments(
  //             config.appwrite_database_Id,
  //             config.appwrite_collection_comments_Id,
  //             query
  //         );
  //         return comments?.documents;
  //     } catch (error) {
  //         console.log('Appwrite Service :: getComments :: Error: ', error);
  //     }
  // }

  async getCommentByUsername(username) {
    try {
      const comments = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        [Query.equal("username", username)]
      );

      return comments.documents;
    } catch (error) {
      console.log("Appwrite Service :: getCommentByUsername :: Error: ", error);
    }
  }

  async getComments(commentId) {
    try {
      const comments = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        [Query.equal("commentId", commentId)]
      );

      return comments.documents;
    } catch (error) {
      console.log("Appwrite Service :: getComments :: Error: ", error);
    }
  }

  async getTweetComments(tweetId) {
    try {
      const tweetComments = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        [Query.equal("tweetId", tweetId)]
      );

      const onlyTweetComments = tweetComments?.documents?.filter(
        (tweetComment) => tweetComment.commentId === ""
      );

      return onlyTweetComments;
    } catch (error) {
      console.log("Appwrite Service :: getTweetComments :: Error: ", error);
    }
  }

  async deleteComment(commentId) {
    try {
      const deleted = await this.databases.deleteDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_comments_Id,
        commentId
      );

      if (deleted) {
        return deleted;
      }
    } catch (error) {
      console.log("Appwrite Service :: deleteComment :: Error: ", error);
    }
  }

  async bookmarkPost({ tweetId, commentId, username }) {
    try {
      const bookmark = await this.databases.createDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_bookmarks_id,
        ID.unique(),
        {
          tweetId,
          commentId,
          username,
        }
      );
      if (bookmark) return bookmark;
    } catch (error) {
      console.log("Appwrite Service :: bookmarkPost :: Error: ", error);
    }
  }

  async deleteBookmark(bookmarkId) {
    try {
      const deleted = await this.databases.deleteDocument(
        config.appwrite_database_Id,
        config.appwrite_collection_bookmarks_id,
        bookmarkId
      );

      return deleted;
    } catch (error) {
      console.log("Appwrite Service :: deleteBookmark :: Error: ", error);
    }
  }

  async getBookmarks(username) {
    try {
      const bookmarks = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_bookmarks_id,
        [Query.equal("username", username), Query.orderDesc("$createdAt")]
      );

      return bookmarks.documents;
    } catch (error) {
      console.log("Appwrite Service :: getBookmarks :: Error: ", error);
    }
  }

  async getBookmarksByTweetId(tweetId) {
    try {
      const tweetBookmarks = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_bookmarks_id,
        [Query.equal("tweetId", tweetId)]
      );
      console.log("method1: ", tweetBookmarks.documents);
      return tweetBookmarks.documents;
    } catch (error) {
      console.log(
        "Appwrite Service :: getBookmarksByTweetId :: Error: ",
        error
      );
    }
  }

  async getBookmarksByCommentId(commentId) {
    try {
      const commentBookmarks = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_bookmarks_id,
        [Query.equal("commentId", commentId)]
      );
      console.log("method2: ", commentBookmarks.documents);
      return commentBookmarks.documents;
    } catch (error) {
      console.log(
        "Appwrite Service :: getBookmarksByTweetId :: Error: ",
        error
      );
    }
  }

  async searchUser(username) {
    console.log(username);
    try {
      const users = await this.databases.listDocuments(
        config.appwrite_database_Id,
        config.appwrite_collection_users_Id,
        [Query.search("username", username)]
      );
      console.log("Users: ", users.documents);
      return users.documents;
    } catch (error) {
      console.log("Appwrite Service :: searchUser :: Error: ", error);
    }
  }
}

const appwriteService = new AppwriteService();

export default appwriteService;

// if we have multiple docs with same attr that we are using to delete them then how to delete those multiple docs with with same attr.
