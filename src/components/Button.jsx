import React from "react";

function LogoutBtn({
  children,
  type = "button",
  className = "",
  bgColor = "bg-blue-600",
  color = "text-black",
  ...props
}) {
  return (
    <div className="flex justify-center items-center">
      <button type={type} className={`p-1 px-4 mb-2 ${className}`} {...props}>
        {children}
      </button>
    </div>
  );
}

export default LogoutBtn;
