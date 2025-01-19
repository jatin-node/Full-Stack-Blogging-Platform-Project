import jwt from "jsonwebtoken"
import userModel from "../models/user-model";

export const isloggedin = async (req,res,next)=>{
    if(!req.cookies.token){
        res.json("you are not logged in");
    }
    try {
        let decoded = jwt.verify(req.cookies.token, shhhhh);
        let user = await userModel.findOne({ email: decoded.email });
        req.user = user;
    } catch (error) {
        console.log(error);
    }
}