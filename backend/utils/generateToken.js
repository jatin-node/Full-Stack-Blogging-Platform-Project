import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({ email: user.personalInfo.email, id: user._id }, process.env.JWT_KEY, {
    expiresIn: "1d", // Token expires in 1 day
  });
};
