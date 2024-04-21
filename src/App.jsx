import { useState } from "react";
import config from "./config/config";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="dark:bg-[#000]  h-auto dark:text-white bg-[#ED729F] text-black overflow-hidden">
      <Outlet />
    </div>
  );
}

export default App;

// bg- [#ED729F]
// border- white
