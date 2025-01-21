import express from "express";
import { isloggedin } from "../middleware/isloggedin.js";
const router = express.Router();
import multer from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

router.get("/editor", isloggedin, (req, res) => {
  res.send("Editor page");
});

router.post("/upload", multer.array('images', 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map(file => 
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "blogify-images" }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        });
        uploadStream.end(file.buffer);
      })
    );
    const urls = await Promise.all(uploadPromises);
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
