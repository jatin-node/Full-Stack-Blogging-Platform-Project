import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
  const [isclicked, setisclicked] = useState(false);
  return (
    <>
      <nav className="navbar w-full flex justify-center">
        <div className="relative w-full max-w-f7xl h-[10vh] border-b-[1px] flex justify-between items-center px-5 md:px-40">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>

          <div className="flex items-center gap-5">
            <div className="relative hidden sm:block">
              <i className="absolute text-xl top-[10px] top right-5 fi fi-rr-search"></i>
              <input
                className=" border-2 pl-4 pr-20 py-2 rounded-full"
                type="text"
                placeholder="Search"
              />
            </div>
            <i
              onClick={() => setisclicked(!isclicked)}
              className="block sm:hidden text-2xl cursor-pointer fi fi-rr-search"
            ></i>
            {/* <Link to="/log-in">
              <span className="auth-btn">Log in</span>
            </Link> */}
            <Link to="/sign-in">
              <span className="auth-btn">Sign in</span>
            </Link>
          </div>
          {isclicked && (
            <div className="absolute top-20 left-0 w-full flex justify-center">
              <input
                className=" border-2  w-full mx-5 pl-4 py-2 rounded-full"
                type="text"
                placeholder="Search"
              />
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
