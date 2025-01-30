import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog, blog: { _id, title, blogId, activity, author: { personalInfo: { username: author_username } }}, setBlog, isLikedByUser, setIsLikedByUser, setCommentWrapper } = useContext(BlogContext);
  let { auth } = useContext(AuthContext);
  
  const handleLike = () => {
    if (auth.token) {
      setIsLikedByUser((prev) => !prev);
      !isLikedByUser ? activity.total_likes++ : activity.total_likes--;
      setBlog({ ...blog, activity });

      axios.post(import.meta.env.VITE_BACKEND_URL + "/blog/like-blog", { _id, isLikedByUser }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(response => {
        // ...existing code...
      }).catch(error => {
        console.log("error encountered");
      });
    } else {
      // not logged in
      toast.error("please login to like this blog");
    }
  }

  useEffect(() => {
    if (auth.token) {
      axios.post(import.meta.env.VITE_BACKEND_URL + `/blog/isliked-by-user/`, { _id }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(({ data: { result } }) => {
        setIsLikedByUser(Boolean(result));
      }).catch(error => {
        console.log({ error: error.message });
      });
    }
  }, [auth.token, _id, setIsLikedByUser]);

  return (
    <>
      <Toaster />
      <hr className="border-zinc-200 my-2" />
      
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button onClick={handleLike} className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red-500/50 text-red-500" : "bg-zinc-200/80"}`}>
            <i className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}></i>
          </button>
          <p className="text-xl text-zinc-400">{activity?.total_likes || 0}</p>

          <button onClick={()=>setCommentWrapper(preval=>!preval)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-200/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-zinc-400">{activity?.total_comments || 0}</p>
        </div>

        <div className="flex gap-6 items-center">
          {auth?.user?.username === author_username ? (
            <Link to={`/${auth?.user?.username}/editor/${blogId}`} className="underline hover:text-purple-500">Edit</Link>
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
