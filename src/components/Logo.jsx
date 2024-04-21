import React from "react";

function Logo({ className }) {
  return (
    <div className={`${className} rounded-full overflow-hidden bg-black`}>
      <img
        src="https://i.pinimg.com/originals/4a/32/f5/4a32f5109fa2d07cfa8647ca968380a2.jpg"
        alt="logo"
        className="object-cover h-full w-full rounded-full"
      />
    </div>
  );
}

export default Logo;
