
import React, { useRef, useEffect } from "react";
import LogoutBtn from "./LogoutBtn";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import { useState } from "react";
import Sidebar from "./Sidebar";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef(null);

  const handleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const navItems = [
    {
      name: "Home",
      slug: "/home",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Profile",
      slug: `/profile/${userData?.username}`,
      active: authStatus,
    },
    {
      name: "Bookmarks",
      slug: "/bookmarks",
      active: authStatus,
    },
    {
      name: "Settings",
      slug: "/settings",
      active: authStatus,
    },
  ];

  useEffect(() => {
    // Function to close the sidebar when clicking outside of it
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[80px] border-b-2 border-white dark:border-red-600 flex justify-between items-center px-8 font-bold">
      <Link to="/home">
        <Logo className="h-[55px] w-[55px] " />
      </Link>
      <div className="hidden md:block">
        <ul className="flex gap-6 justify-center items-center">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `dark:hover:bg-red-600 hover:text-[#ED729F] hover:bg-white  p-2 px-3 rounded-full ${
                        isActive
                          ? "dark:text-red-500 text-white"
                          : "dark:text-white text-black"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              )
          )}

          {authStatus && (
            <li>
              <LogoutBtn className="rounded-full text-black dark:text-white dark:hover:bg-red-600 hover:text-[#ED729F] hover:bg-white">
                Logout
              </LogoutBtn>
            </li>
          )}
        </ul>
      </div>
      <div className="md:hidden h-full" ref={sidebarRef}>
        <nav
          id="nav1"
          className="flex items-center justify-center h-full cursor-pointer"
          onClick={handleMenu}
          onBlur={() => setShowMenu(false)}
        >
          <i className="ri-menu-line dark:text-white text-white"></i>
        </nav>
        {showMenu && (
          <Sidebar
            navItems={navItems}
            handleMenu={handleMenu}
            showMenu={showMenu}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
