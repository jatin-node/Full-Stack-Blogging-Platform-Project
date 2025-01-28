import express from "express"
import blogModel from "../models/blog-model.js";
import userModel from "../models/user-model.js";
const router = express.Router()

router.post("/get-blog", (req,res)=>{
    let { blogId } =  req.body;
    let incrementalVal = 1;

    blogModel.findOneAndUpdate({ blogId }, { $inc : { "activity.total_reads": incrementalVal }})
    .populate("author", "personalInfo.Fullname personalInfo.username personalInfo.profile_img")
    .select("title desc banner activity publishedAt blogId tags")
    .then(blog =>{
        userModel.findOneAndUpdate({ "personalInfo.username": blog.author.personalInfo.username },{
            $inc: { "accountInfo.total_reads": incrementalVal }
        })
        .catch( err => {
            return res.status(500).json({err: err.message});
        })
        return res.status(200).json({blog});
    })
    .catch(err =>{
        return res.status(500).json({err: err.message});
    })
})

export default router;