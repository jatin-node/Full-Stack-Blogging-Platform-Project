import express from "express";
import blogModel from "../models/blog-model.js";
import userModel from "../models/user-model.js";
import Notification from "../models/notification-model.js"; // Import Notification model
import { isloggedin } from "../middleware/isloggedin.js";
import Comment from "../models/comment-model.js";
const router = express.Router();

router.post("/get-blog", (req, res) => {
  let { blogId, draft, mode } = req.body;
  let incrementalVal = mode !== "edit" ? 1 : 0;

  blogModel
    .findOneAndUpdate(
      { blogId },
      { $inc: { "activity.total_reads": incrementalVal } }
    )
    .populate(
      "author",
      "personalInfo.Fullname personalInfo.username personalInfo.profile_img"
    )
    .select("title desc banner content activity publishedAt blogId tags draft")
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ err: "Blog not found" });
      }

      if (blog.draft && !draft) {
        return res.status(403).json({ err: "You cannot access draft blogs" });
      }

      userModel
        .findOneAndUpdate(
          { "personalInfo.username": blog.author.personalInfo.username },
          {
            $inc: { "accountInfo.total_reads": incrementalVal },
          }
        )
        .catch((err) => {
          return res.status(500).json({ err: err.message });
        });

      return res.status(200).json({ blog });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
});

router.post("/isliked-by-user", isloggedin, (req, res) => {
    let user_id = req.user._id;
  let { _id } = req.body;
  Notification.exists({user: user_id, type: "like", blog: _id})
  .then(result=>{
    return res.status(200).json({ result });
  })
   .catch(err=>{
      return res.status(500).json({ err: err.message });
    });
});

router.post("/like-blog", isloggedin, (req, res) => {
  let user_id = req.user._id;
  let { _id, isLikedByUser } = req.body;
  let incrementalVal = !isLikedByUser ? 1 : -1;

  blogModel
    .findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": incrementalVal } }
    )
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ err: "Blog not found" });
      }
      if (!isLikedByUser) {
        let like = new Notification({
          type: "like",
          blog: _id,
          notification_for: blog.author,
          user: user_id,
        });
        like
          .save()
          .then((notification) => {
            return res.status(200).json({ liked_by_user: true });
          })
          .catch((err) => {
            return res.status(500).json({ err: err.message });
          });
      } else {
        Notification.findOneAndDelete({
            user: user_id,
            type: "like",
            blog: _id,
        })
         .then((notification) => {
            return res.status(200).json({ liked_by_user: false });
          })
          .catch((err) => {
            return res.status(500).json({ err: err.message });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
});

router.post("/comment-blog", isloggedin, (req, res) => {
  let user_id = req.user._id;
  let { _id, comment, replying_to, blog_author } = req.body;

  if (!comment.length) {
    return res.status(403).json({ err: "Comment cannot be empty" });
  }

  // creating a comment doc
  let commentObj = new Comment({
    blogId: _id,
    blog_author,
    comment,
    commented_by: user_id,
  });
  commentObj.save().then((commentFile) => {
      let { comment, commentedAt, children } = commentFile;
      blogModel
        .findOneAndUpdate(
          { _id },
          {
            $push: { comments: commentFile._id },
            $inc: { "activity.total_comments": 1, "activity.total_parent_comments": 1 },
          }
        )
        .then((blog) => {
          if (!blog) {
            return res.status(404).json({ err: "Blog not found" });
          }
          console.log("New comment created");

          let notificationObj = {
            type: "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id,
          };

          new Notification(notificationObj)
            .save()
            .then(() => {
              console.log("Added comment");
              return res.status(200).send({
                comment,
                commentedAt,
                _id: commentFile._id,
                user_id,
                children,
              });
            })
            .catch((err) => {
              return res.status(500).json({ err: err.message });
            });
        })
        .catch((err) => {
          return res.status(500).json({ err: err.message });
        });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
});

router.post("/get-blog-comments", (req, res) => {
  console.log("/get-blog-comments")
  let { blogId, skip } = req.body;
  let maxLimit = 5;

  Comment.find({ blogId, isReply: false })
  .populate("commented_by", "personalInfo.username personalInfo.Fullname personalInfo.profile_img")
  .skip(skip)
  // .limit(maxLimit)
  .sort({
      'commentedAt': -1
  })
  .then(comment => {
      return res.status(200).json(comment);
  })
  .catch(err => {
      console.log(err.message);
      return res.status(500).json({ error: err.message })
  })

});

export default router;
