import React, { useContext } from "react";
import AnimationWrapper from "./AnimationWrapper";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const UserNavigationPanel = () => {
  const { auth, setAuth } = useContext(AuthContext);
  console.log(auth);

  const signOut = async () => {
    let backendLink =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const response = await axios.get(`${backendLink}/log-out`, {
      withCredentials: true,
    });
    setAuth({ token: null });
    console.log(response.data);
  };

  return (
    <AnimationWrapper transition={{ duration: 0.2 }}>
      <div className="w-60 bg-white absolute right-0 border border-gray-100 overflow-hidden duration-200">
        <Link
          to={`${auth.user.username}/editor`}
          className="flex gap-2 link pl-8 py-4 font-semibold"
        >
          <i className="fi fi-tr-file-edit"></i>
          <span className="">Write</span>
        </Link>
        <Link to={`user/${auth.user.username}`} className="link pl-8 py-4">
          Profile
        </Link>
        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to="/settings/edit-profile" className="link pl-8 py-4">
          Settings
        </Link>
        <hr />
        <button
          onClick={signOut}
          className="w-full p-4 py-4 pl-8 text-left hover:bg-gray-100 "
        >
          <h1 className="text-red-500 font-semibold">Sign Out</h1>
          <p className="text-gray-500">@{auth.user.username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
