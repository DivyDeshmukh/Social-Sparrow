import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../store/themeSlice";
import appwriteService from "../appwrite/config";
import { login } from "../store/authSlice";

function SettingsPage() {
  const userData = useSelector((state) => state.auth.userData);
  // const [theme, setTheme] = useState(userData?.theme);
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);

  const darkMode = async () => {
    dispatch(setThemeMode("dark"));
    try {
      const updated = await appwriteService.updateUserProfile({
        userId: userData.$id,
        ...userData,
        theme: "dark",
      });
      if (updated) {
        dispatch(login(updated));
      }
    } catch (error) {
      throw error;
    }
  };

  const lightMode = async () => {
    dispatch(setThemeMode("light"));

    try {
      const updated = await appwriteService.updateUserProfile({
        userId: userData.$id,
        ...userData,
        theme: "light",
      });
      if (updated) {
        dispatch(login(updated));
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");

    document.querySelector("html").classList.add(themeMode);
  }, [userData?.theme]);

  return (
    <div className="flex flex-col justify-center items-center gap-8 px-4 md:px-40 mt-4 pb-6 w-full h-full font-bold mb-12">
      <div
        id="content"
        className="w-full md:w-3/4 border-2 border-white dark:border-red-500"
      >
        <div
          id="top"
          className="flex gap-2 pl-4 pt-2 border-b-2 border-b-white dark:border-b-red-500 pb-2 mb-8 text-white dark:text-red-500"
        >
          <i className="ri-settings-5-fill text-3xl"></i>
          <h1 className="text-3xl">Settings</h1>
        </div>

        <div id="settings" className="flex flex-col gap-2 mb-8">
          <div
            id="deleteUser"
            className="bg-slate-400 dark:bg-[#242D34] p-2 pl-4"
          >
            <button>Delete Account</button>
          </div>
          <div
            id="theme"
            className="bg-slate-400 dark:bg-[#242D34] p-2 pl-4 flex justify-between"
          >
            <p>Theme</p>
            <div
              className={`${
                userData?.theme === "dark" ? "bg-black" : "bg-[#ED729F]"
              } w-[50px] h-[25px] rounded-xl mr-2 cursor-pointer transition-all duration-200`}
            >
              {userData?.theme !== "dark" ? (
                <button
                  className="h-full w-[25px] ml-1/2 bg-black rounded-xl transition-all duration-200"
                  onClick={darkMode}
                ></button>
              ) : (
                <button
                  className="h-full w-[25px] bg-[#ED729F] rounded-xl transition-all duration-200"
                  onClick={lightMode}
                ></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
