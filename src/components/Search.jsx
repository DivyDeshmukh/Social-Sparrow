import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";

function Search({ username, className }) {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [profileSrc, setProfileArr] = useState([]);

  const searchUser = async () => {
    try {
      const timeoutId = setTimeout(async () => {
        const users = await appwriteService.searchUser(username);
        // console.log(users);
        if (users) {
          setUsers(users);
        }
      }, 500);
      setId(timeoutId);
      getProfile();
    } catch (error) {
      throw error;
    }
  };

  const getProfile = async (profileId) => {
    const promises = users?.map(async (user) => {
      return await appwriteService.getProfileImage(user.user_profile_id);
    });

    const resolvedPromises = await Promise.all(promises);
    // console.log(resolvedPromises);
    setProfileArr(resolvedPromises);
  };

  useEffect(() => {
    searchUser();
    return () => clearTimeout(id);
  }, [username]);

  useEffect(() => {
    getProfile();
  }, [users]);

  useEffect(() => {
    // console.log(profileSrc);
  }, [profileSrc]);

  return (
    <div
      className={`flex flex-col gap-4 text-red-500 w-full h-auto items-center pt-4 pb-6 ${className}`}
    >
      <ul className="flex flex-col items-start justify-start gap-4 w-full h-auto pt-4 px-4">
        {users.length !== 0 ? (
          users?.map((user, index) => (
            <li
              key={index}
              className="flex gap-6 w-full h-auto p-4 justify-center pl-6 bg-black items-center rounded-lg flex-wrap"
            >
              <div
                id="img"
                className="h-[55px] w-[55px] rounded-full overflow-hidden"
              >
                <img
                  src={profileSrc[index]}
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div id="right" className="flex flex-col">
                <h1 className="text-white text-lg">{user?.name}</h1>
                <h3 className="text-red-600 text-sm">@{user?.username}</h3>
              </div>
            </li>
          ))
        ) : (
          <div className="w-full flex items-center justify-center p-4 text-center bg-black">
            <h1>Username with this name do not exists</h1>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Search;
