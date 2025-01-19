import express from "express";
const router = express.Router();

router.get("/editor", (req,res)=>{
    res.json("Editor page");
})

export default router;