import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  // useEffect(() => {
  //   if (authentication && authStatus === true) {
  //     console.log('authentication');
  //       navigate("/home");
  //   } else if (authentication && authStatus === false) {
  //       navigate("/login")
  //   }
  //   setLoader(false);
  //   console.log(authStatus);
  // }, [authStatus, authentication, navigate]);

  useEffect(() => {
    if (authStatus === true) {
      // navigate("/home");
    }

    if (authStatus === false) {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  useEffect(() => {
    setLoader(false);
  }, []);

  return (
    <div className="overflow-hidden min-h-[100vh]">
      <Header />
      {loader ? <h1>Loading...</h1> : children}
      <Footer />
    </div>
  );
}

export default AuthLayout;
