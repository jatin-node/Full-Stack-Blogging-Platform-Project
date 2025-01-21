import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";

export const isloggedin = async (req, res, next) => {
  if (!req.cookies.token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel.findOne({"personalInfo.email": decoded.email}).select("personalInfo");
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
