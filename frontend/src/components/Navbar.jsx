import React, { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserNavigationPanel from "./UserNavigationPanel";
import { toast, Toaster } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isclicked, setisclicked] = useState(false);
  const [userNavPanel, setuserNavPanel] = useState(false);
  const { auth } = useContext(AuthContext);

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const handleblur = () => {
    setTimeout(() => {
      setuserNavPanel(false);
    }, 100);
  };

  const handleSearch = (e) => {
    let query = e.target.value;
    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const handleEditorClick = () => {
    if (auth.user) {
      navigate(`/${auth.user.username}/editor`);
    } else {
      toast.error("Sign-in required.");
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar w-full flex justify-center">
        <div className="relative w-full max-w-full h-[10vh]  flex justify-between items-center px-5">
          <div className="flex items-center gap-5">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
            <div className="relative hidden sm:block">
              <i className="absolute text-xl top-[10px] top right-5 fi fi-rr-search"></i>
              <input
                className=" border-2 pl-4 pr-10 md:pr-20 py-2 rounded-full"
                type="text"
                placeholder="Search"
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <i
              onClick={() => setisclicked(!isclicked)}
              className="block sm:hidden text-2xl cursor-pointer fi fi-rr-search"
            ></i>

            {auth.user ? (
              <>
                <div
                  onClick={handleEditorClick}
                  className="hidden sm:flex items-center gap-2 link pl-4 bg-zinc-100 rounded-md py-3 font-semibold cursor-pointer"
                >
                  <i className="fi fi-tr-file-edit"></i>
                  <span className="">Write</span>
                </div>
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
                <div
                  onClick={handleEditorClick}
                  className="flex items-center gap-2 link pl-4 bg-zinc-100 rounded-md py-3 font-semibold cursor-pointer"
                >
                  <i className="fi fi-tr-file-edit"></i>
                  <span className="">Write</span>
                </div>
                <Link to="/sign-in">
                  <span className="auth-btn">Sign in</span>
                </Link>
              </>
            )}
          </div>
          {isclicked && (
            <div className="absolute top-20 left-0 w-full flex justify-center">
              <input
                className=" border-2 w-full pl-4 py-2 rounded-full"
                type="text"
                placeholder="Search"
                onKeyDown={handleSearch}
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
