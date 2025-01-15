import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { nanoid } from "nanoid";

let emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regex for email
let passwordregex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/; // regex for password
let nameregex = /^(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$/; // regex for name

//function to make generate unique Username
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExists = await userModel
    .exists({ "personalInfo.username": username })
    .then((result) => result);
  isUsernameExists ? (username += nanoid().substring(0, 5)) : "";
  return username;
};
//sign-up function
export const registerUser = async (req, res) => {
  try {
    const { Fullname, Password, email } = req.body;
    if (!nameregex.test(Fullname)) {
      return res.status(400).json("Fullname is Invalid");
    }
    if (!emailregex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!passwordregex.test(Password)) {
      return res.status(400).json({
        error:
          "Password should be 7 to 20 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }
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
        res.cookie("token", token);
        res.json(newUser);
      });
    });
    console.log("done");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//login function
export const loginUser = async (req, res) => {
  let { email, Password } = req.body;
  if (!emailregex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!passwordregex.test(Password)) {
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
      res.cookie("token", token);
      res.json(user);
    } else {
      return res.status(401).send("Incorrect email or password");
    }
  });
};
//logout function
export const logOutUser = (req, res) => {
  res.cookie("token", "");
  res.json("log-out successfull");
};
