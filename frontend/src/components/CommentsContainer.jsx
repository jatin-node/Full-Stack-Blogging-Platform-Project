import React, { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import CommentField from "./CommentField";
import axios from "axios";
import AnimationWrapper from "./AnimationWrapper";
import CommentCard from "./CommentCard";
import NoDataMessage from "./NoDataMessage";

export const fetchComments = async ({skip = 0, blogId, setParentCommentCountFun, comment_array = null}) =>{
    let res;

    await axios.post(import.meta.env.VITE_BACKEND_URL + "/blog/get-blog-comments", { skip, blogId })
    .then(({ data }) => {
        data.forEach((comment) =>{
            comment.childrenLevel = 0;
        })
        setParentCommentCountFun(preval => preval  + data.length)
        if(comment_array === null) {
            res = { results: data }
        } else {
            res = { results: [...comment_array,...data] }
        }
    })
    .catch(err => {
        console.error(err);
    });

    return res;
}

const CommentsContainer = () => {
  let { blog: { title, comments: { results: commentsArr } }, commentWrapper, setCommentWrapper } = useContext(BlogContext);
  console.log(commentsArr);
  return (
    <div
      className={`max-sm:w-full fixed ${
        commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"
      } duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}
    >
        <div className="relative">
            <h1 className="text-xl font-medium">Comments</h1>
            <p className="text-lg mt-2 w-[70%] text-zinc-400 line-clamp-1">{title}</p>

            <button onClick={()=>setCommentWrapper(preval=>!preval)} className="absolute top-0 right-0 flex justify-center items-center w-12 h-12  rounded-full bg-zinc-100">
            <i className="fi fi-br-cross text-xl mt-1"></i>
        </button>
        </div>

        <hr className="border-zinc-200 my-8 w-[120%] -ml-10" />
        {/* Comment List */}
        <CommentField action="comment" />
        {
            commentsArr && commentsArr.length ?
            commentsArr.map((comment, index) => (
                <AnimationWrapper key={index}>
                    <CommentCard index={index} leftVal={comment.childrenLevel * 4} commentData={comment} />
                </AnimationWrapper>
            )) : (
                <NoDataMessage message="No Comments" />
            )
        }
    </div>
  );
};

export default CommentsContainer;
