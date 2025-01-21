import React, { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserNavigationPanel from "./UserNavigationPanel";

const Navbar = () => {
  const [isclicked, setisclicked] = useState(false);
  const [userNavPanel, setuserNavPanel] = useState(false);
  const { auth } = useContext(AuthContext);

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const handleblur = ()=>{
    setTimeout(() => {
      setuserNavPanel(false);
    }, 100);
  }

  return (
    <>
      <nav className="navbar w-full flex justify-center">
        <div className="relative w-full max-w-7xl h-[10vh]  flex justify-between items-center px-5 md:px-20">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>

          <div className="flex items-center gap-5 ">
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
            {auth.user ? (
              <>
                <Link to="/dashboard/notification">
                  <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-black/10 relative">
                    <i className="fi fi-rs-bell text-xl block mt-1"></i>
                  </button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setuserNavPanel(!userNavPanel)}
                    onBlur={handleblur}
                    className="w-12 h-12 mt-1"
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={`${backendBaseUrl}/images/${auth.user.profile_img}`}
                      alt=""
                    />
                  </button>
                  {userNavPanel && <UserNavigationPanel />}
                </div>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <span className="auth-btn">Sign in</span>
                </Link>
              </>
            )}
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
