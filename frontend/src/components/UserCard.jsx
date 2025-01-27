import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ data }) => {
  let { personalInfo: { Fullname, username, profile_img } } = data;
  return (
    <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
      <img
        src={profile_img}
        alt={Fullname}
        className="w-14 h-14 rounded-full"
      />
      <div className="ml-3">
        <h1 className="font-semibold text-xl line-clamp-2">{Fullname}</h1>
        <p className="text-zinc-500">@{username}</p>
      </div>
    </Link>
  );
};

export default UserCard;
