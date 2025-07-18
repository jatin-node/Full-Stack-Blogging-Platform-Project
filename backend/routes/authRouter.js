import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logOutUser,
} from "../controllers/authController.js";
import blogModel from "../models/blog-model.js";
import userModel from "../models/user-model.js";

// router.get("/", (req,res)=>{
//     res.send("hello world!");
// });

router.post("/sign-in", registerUser);
router.post("/log-in", loginUser);
router.get("/log-out", logOutUser);

router.post("/search-blogs", (req, res) => {
  let { tag, author, query, limit, eliminate_blog } = req.body;
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false, blogId: { $ne: eliminate_blog } };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if(author){
    findQuery = { author, draft: false };
  }
  let maxLimit = limit ? limit : 50;

  blogModel
    .find(findQuery)
    .populate(
      "author",
      "personalInfo.Fullname personalInfo.profile_img personalInfo.username -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blogId title desc banner activity tags publishedAt -_id ")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

router.post("/get-profile", (req, res) => {
  const { username } = req.body;
  userModel
    .findOne({ "personalInfo.username": username })
    .select("-personalInfo.password -google_auth -blogs -updatedAt")
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

router.post("/search-users", (req, res) => {
  let { query } = req.body;
  userModel
    .find({ "personalInfo.Fullname": new RegExp(query, "i") })
    .select(
      "personalInfo.Fullname personalInfo.profile_img personalInfo.username -_id"
    )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

router.get("/trending-blogs", (req, res) => {
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personalInfo.Fullname personalInfo.profile_img personalInfo.username -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_links": -1,
      publishedAt: -1,
    })
    .select("blogId title publishedAt -_id ")
    .limit(10)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

router.get("/latest-blogs", (req, res) => {
  let maxLimit = 5;
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personalInfo.Fullname personalInfo.profile_img personalInfo.username -_id"
    )
    .sort({ createdAt: -1 })
    .select("blogId title desc content banner activity tags publishedAt -_id ")
    // .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

export default router;
