import express from "express";
import { isloggedin } from "../middleware/isloggedin.js";
const router = express.Router();
import multer from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { nanoid } from "nanoid";
import blogModel from "../models/blog-model.js";
import userModel from "../models/user-model.js";

const uploadImagesToCloudinary = (files) => {
  return files.map(
    (file) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blogify-images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      })
  );
};

router.get("/editor", isloggedin, (req, res) => {
  res.send("Editor page");
});

router.post("/upload", multer.array("images", 10), isloggedin, async (req, res) => {
    try {
      const uploadPromises = uploadImagesToCloudinary(req.files);
      const urls = await Promise.all(uploadPromises);
      res.status(200).json({ urls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


router.post("/create-blog", isloggedin, async (req, res) => {
  try {
    const { title, desc, tags, banner, draft } = req.body;
    if (!draft) {
      if (!title && !desc && !tags && !banner) {
        return res.status(400).json({ error: "All fields are required" });
      }
    }
    const authorId = req.user._id;
    const formattedTags = tags.map((tag) => tag.toLowerCase());
    const blogId = `${title
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/\s+/g, "-")
      .trim()}${nanoid()}`;

    const blog = await blogModel.create({
      blogId,
      title,
      desc,
      tags: formattedTags,
      banner,
      draft: Boolean(draft),
      author: authorId,
    });
    const user = await userModel.findById(authorId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.accountInfo.total_posts += 1;
    user.blogs.push(blog._id);
    await user.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
