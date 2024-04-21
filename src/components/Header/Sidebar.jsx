import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

function Sidebar({ navItems, handleMenu, showMenu }) {
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <div
      className={`h-[91.25vh] w-[40vw] bg-white text-[#ED729F] dark:bg-red-500 absolute z-[100] right-0 top-[9.75vh] transition-all duration-400 ${
        showMenu ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="flex flex-col mt-8 justify-center items-center w-full">
        {navItems.map(
          (item) =>
            item.active && (
              <li
                key={item.name}
                className="w-full dark:hover:bg-black dark:hover:text-red-500 px-3 p-2 hover:bg-[#ED729F] hover:text-white"
              >
                <NavLink
                  to={item.slug}
                  className={({ isActive }) =>
                    `p-2 px-3 rounded-full w-full ${
                      isActive
                        ? "text-black dark:bg-amber-500 dark:hover:text-red-500"
                        : "text-[#ED729F] hover:text-white dark:text-white dark:hover:text-red-500 w-full"
                    }`
                  }
                  onClick={handleMenu}
                >
                  {item.name}
                </NavLink>
              </li>
            )
        )}

        {authStatus && (
          <li className=" text-[#ED729F] dark:text-white md:hidden w-full hover:bg-[#ED729F] hover:text-white dark:hover:bg-black dark:hover:text-red-500 px-3 p-2">
            <NavLink to={`/explore`} className="flex gap-1">
              <i className="ri-search-line"></i>
              <h1>Explore</h1>{" "}
            </NavLink>
          </li>
        )}

        {authStatus && (
          <li className="w-full hover:bg-[#ED729F] hover:text-white dark:hover:bg-black dark:hover:text-red-500 px-3 py-0">
            <LogoutBtn className="hover:bg-[#ED729F] hover:text-white dark:hover:text-red-500 dark:hover:bg-black rounded-full ">
              Logout
            </LogoutBtn>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
