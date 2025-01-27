import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    personalInfo: {
      Fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, "Username must be 3 letters long"],
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not contain more than 200 characters"],
        default: "",
      },
      profile_img: {
        type: String,
        default: "/default_profile.png"
      },
    },
    accountInfo: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
    }],
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("users", userSchema);
