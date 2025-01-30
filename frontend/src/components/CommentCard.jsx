import React from "react";
import GetDay from "./GetDay";

const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personalInfo: { Fullname, username, profile_img },
    },
    commentedAt,
    comment,
  } = commentData;

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-zinc-200">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {Fullname} @{username}
          </p>
          <p className="min-w-fit">{GetDay(commentedAt)}</p>
        </div>
        <p className="font-sans text-xl ml-3">{comment}</p>
        {/* <div>
      </div> */}
      </div>
    </div>
  );
};

export default CommentCard;
