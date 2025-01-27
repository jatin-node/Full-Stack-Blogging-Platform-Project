import React from "react";
import { Link } from "react-router-dom";
import GetDay from "./GetDay";

const BlogPost = ({ blog, index }) => {
  const {
    title,
    publishedAt,
    blogId,
    author: {
      personalInfo: { Fullname, profile_img, username },
    },
  } = blog;
  return (
    <Link className="flex gap-8 items-start border-b border-zinc-200 pb-5 mb-4" to={`/blog/${blogId}`}>
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
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
      </div>
    </Link>
  );
};

export default BlogPost;
