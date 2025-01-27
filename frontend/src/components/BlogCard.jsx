import React from "react";
import GetDay from "./GetDay";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, author }) => {
  const { title, desc, banner, tags, publishedAt, activity: { total_likes }, blogId } = blog;
  const { Fullname, profile_img, username } = author;
  return (
    <Link
      className="flex gap-8 items-center border-b border-zinc-200 pb-5 mb-4"
      to={`/blog/${blogId}`}
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            className="w-6 h-6 rounded-full"
            alt="profile_img"
          />
          <p className="line-clamp-1">
            {Fullname}@{username}
          </p>
          <p className="min-w-fit">{GetDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-serif leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2 ">
          {desc}
        </p>
        <div className="flex gap-4 mt-4 ">
          <span className="whitespace-nowrap bg-zinc-300 text-white rounded-full py-1 px-4 capitalize hover:bg-opacity-80">
            {tags[0]}
          </span>
          <span className="ml-3 flex items-center gap-2 text-zinc-400">
            <i className="fi fi-rs-social-network"></i>
            {total_likes}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-zinc-200">
        <img src={banner} className="w-full h-full object-cover" alt="banner" />
      </div>
    </Link>
  );
};

export default BlogCard;
