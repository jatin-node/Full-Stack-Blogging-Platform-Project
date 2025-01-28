import React, { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BlogInteraction = () => {
  let {
    blog: {
      title,
      blogId,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personalInfo: { username: author_username },
      },
    },
    setBlog,
  } = useContext(BlogContext);

  let { auth } = useContext(AuthContext);

  return (
    <>
      <hr className="border-zinc-200 my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-200/80">
            <i className="fi fi-rr-heart"></i>
          </button>
          <p className="text-xl text-zinc-400">{total_likes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-200/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-zinc-400">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {auth?.user?.username === author_username ? (
            <Link to={`/editor/${blogId}`} className="underline hover:text-purple-500">Edit</Link>
          ) : (
            ""
          )}

          <Link
            to={`https://twitter.com/intent/tweet/?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-[#1DA1F2]"></i>
          </Link>
        </div>
      </div>

      <hr className="border-zinc-200 my-2" />
    </>
  );
};

export default BlogInteraction;
