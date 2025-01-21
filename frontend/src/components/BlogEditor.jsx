import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import AnimationWrapper from "./AnimationWrapper";
import defaultBanner from "../assets/images/blogbanner.png";
import { AuthContext } from "../context/AuthContext";
import { apiUpload } from "../utils/api";
import { toast, Toaster } from "react-hot-toast";

const BlogEditor = () => {
  const { auth } = useContext(AuthContext);
  const [bannerUrl, setBannerUrl] = useState(defaultBanner);

  // Blog Title enter avoid function
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  // Blog Title height function 
  const handleTitleChange = (e)=>{
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  }

  // image banner upload function
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("images", e.target.files[0]);
    console.log(e.target.files[0]);
    const toastId = toast.loading("Uploading image...");
    try {
      const response = await apiUpload(
        `/${auth.user.username}/upload`,
        formData
      );
      setBannerUrl(response.urls[0]);
      toast.dismiss(toastId);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response ? error.response.data : error.message
      );
      toast.dismiss(toastId);
      toast.error("Error uploading image.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
        <div className="flex gap-4 ml-auto">
          <button className="auth-btn py-2">Publish</button>
          <button className="auth-btn py-2">Save Draft</button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section className="w-full">
          <div className="mx-auto max-w-[900px] w-full p-5">
            <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-zinc-200">
              <label htmlFor="uploadBanner">
                <img src={bannerUrl} className="z-20" alt="" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleUpload}
                />
              </label>
            </div>
            <textarea
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-5 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
