import React from "react";
import { Link } from "react-router-dom";
import "../css/landingPage.css";
import Logo from "./Logo";

function LandingPage() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-6">
      <div
        id="top"
        className="flex gap-4 w-full items-center justify-center flex-col"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-center dark:text-white text-white">
          Welcome to Social Sparrow...
        </h1>
        <Logo className="h-[55px] w-[55px] md:h-[75px] md:w-[75px]" />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center items-center gap-16">
        <div
          id="img"
          className="h-auto w-[90vw] md:w-[45vw] rounded-2xl overflow-hidden"
        >
          <img
            src="https://movieguide.b-cdn.net/wp-content/uploads/2019/08/Angry-Birds-2.jpg"
            alt="landing_image"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="authBox flex flex-col gap-4 border-2 border-white dark:border-red-500 p-4 -translate-y-8 text-center md:text-left">
          <Link
            to="/login"
            className="dark:text-black font-bold dark:bg-red-500 p-1 text-center rounded-lg px-4 py-2 text-sm md:text-lg dark:hover:bg-black hover:border-2 dark:hover:border-red-500 dark:hover:text-red-500 bg-white text-[#ED729F] hover:bg-[#ED729F] hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="dark:text-black dark:bg-red-500 p-1 text-center rounded-lg px-4 py-2 text-sm md:text-lg font-bold dark:hover:bg-black hover:border-2 dark:hover:border-red-500 dark:hover:text-red-500 bg-white text-[#ED729F] hover:bg-[#ED729F] hover:text-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
