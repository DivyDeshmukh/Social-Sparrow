import React from "react";
import "../App.css";

function Logo({ parentClassname = "", textClassname = "", className = "" }) {
  return (
    <div
      className={`${
        parentClassname ? parentClassname : "flex"
      } items-center justify-center gap-2`}
    >
      <h1
        id="logo-txt"
        className={`${
          textClassname !== "" ? textClassname : "order-2"
        } dark:text-white text-white font-semibold`}
      >
        SocialSparrow
      </h1>

      <div
        className={`${className} rounded-full overflow-hidden bg-white p-1 dark:bg-black`}
      >
        <img
          src="https://i.pinimg.com/originals/4a/32/f5/4a32f5109fa2d07cfa8647ca968380a2.jpg"
          alt="logo"
          className="object-cover h-full w-full rounded-full "
        />
      </div>
    </div>
  );
}

export default Logo;
