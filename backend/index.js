import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import DB from "./config/mongoose-connection.js";
import cors from "cors";
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: isProduction
      ? process.env.VITE_FRONTEND_URL // Production URL
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
