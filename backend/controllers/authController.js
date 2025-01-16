import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { nanoid } from "nanoid";
import { emailRegex, nameRegex, passwordRegex } from "../utils/validation.js";

// data to send to frontend
const datatoSend = (user) => {
  return {
    profile_img: user.personalInfo.profile_img,
    username: user.personalInfo.username,
    Fullname: user.personalInfo.Fullname,
  };
};

//function to make generate unique Username
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExists = await userModel.exists({
    "personalInfo.username": username,
  });
  if (isUsernameExists) {
    username += nanoid().substring(0, 5);
  }
  return username;
};

//sign-up function
export const registerUser = async (req, res) => {
  try {
    const { Fullname, Password, email } = req.body;

    // Checking if user account is already created
    let user = await userModel.findOne({
      "personalInfo.email": email,
    });
    if (user) return res.status(409).send("Email already exists.");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(Password, salt, async (err, hash) => {
        let username = await generateUsername(email);
        let newUser = await userModel.create({
          personalInfo: {
            Fullname,
            email,
            password: hash,
            username,
          },
        });
        let token = generateToken(newUser);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ token, user: datatoSend(newUser) });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//login function
export const loginUser = async (req, res) => {
  let { email, Password } = req.body;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!passwordRegex.test(Password)) {
    return res.status(400).json({
      error:
        "Password should be 7 to 20 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character",
    });
  }

  let user = await userModel.findOne({ "personalInfo.email": email });
  if (!user) {
    return res.status(401).send("Incorrect email or password");
  }
  bcrypt.compare(Password, user.personalInfo.password, (err, result) => {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.json({ token, user: datatoSend(user) });
    } else {
      return res.status(401).send("Incorrect email or password");
    }
  });
};
//logout function
export const logOutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.json();
};
