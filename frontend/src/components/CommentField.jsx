import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import BlogContent from "./BlogContent";
import { BlogContext } from "../pages/BlogPage";
import axios from "axios";

const CommentField = ({ action }) => {
    const { blog, setBlog, comments, setTotalParentComments } = useContext(BlogContext);
    const { _id, activity, comments: { results: commentsArr }, author: { _id: blog_author } } = blog;
    // console.log(comments);

  const [comment, setComment] = useState("");
  const { auth } = useContext(AuthContext);
  const handleComment = () => {
    if (!auth.token) {
      return toast.error("Log-in first to comment");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment...");
    }

    axios.post(import.meta.env.VITE_BACKEND_URL + "/blog/comment-blog", {
      _id, blog_author, comment, }, {
        headers: { Authorization: `Bearer ${auth.token}` }
    })
    .then(({ data })=>{
        console.log(data);
        setComment("");
        data.commented_by = { personalInfo: { Fullname: auth.user.Fullname, username: auth.user.username, profile_img: auth.user.profile_img } }
        
        let newCommentarr;
        data.childrenlevel = 0;

        newCommentarr = [ data, ...commentsArr ];

        let parentcommentincremental = 1;

        setBlog({...blog, comments: {...comments, results: newCommentarr}, activity: {...activity, total_comments: activity.total_comments + 1, total_parent_comments: activity.total_parent_comments + parentcommentincremental}})
        
        setTotalParentComments(preval=>preval + parentcommentincremental);
    })
    .catch((error) => {
        console.log(error);
        toast.error("Failed to comment. Please try again later.");
    });
  };

  return (
    <>
      <Toaster />
      {/* <h2>{activity?.total_comments || 0} Comments</h2> */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full rounded-md p-4 bg-zinc-100 border focus:bg-transparent placeholder:text-black pl-5 placeholder: border-zinc-400 resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleComment} className="auth-btn my-5 px-8">
        {action}
      </button>
    </>
  );
};

export default CommentField;
