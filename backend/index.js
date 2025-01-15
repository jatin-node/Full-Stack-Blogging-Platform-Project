import "dotenv/config";
import express from "express";
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRouter.js";
import DB from "./config/mongoose-connection.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
