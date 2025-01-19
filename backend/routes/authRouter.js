import express from "express";
const router = express.Router();
import { registerUser, loginUser, logOutUser } from "../controllers/authController.js";

router.get("/", (req,res)=>{
    res.send("hello world!");
});

router.post("/sign-in", registerUser);
router.post("/log-in", loginUser);
router.get("/log-out", logOutUser);

export default router;