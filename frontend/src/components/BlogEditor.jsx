import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import AnimationWrapper from "./AnimationWrapper";
import defaultBanner from "../assets/images/blogbanner.png";
import { AuthContext } from "../context/AuthContext";
import { apiPost, apiUpload } from "../utils/api";
import { toast, Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import EditorJs from "@editorjs/editorjs";
import { tools } from "./Tools";

const BlogEditor = () => {
  const { auth } = useContext(AuthContext);

  const {
    blog,
    blog: { title, banner, content, tags, desc, author },
    setBlog,
    seteditorState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  // Blog Title enter avoid function
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  // Blog Title height function
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  // Blog Description height function
  const handleDescChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, desc: input.value });
  };

  // image banner upload function
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("images", e.target.files[0]);

    const toastId = toast.loading("Uploading image...");
    try {
      const response = await apiUpload(
        `/${auth.user.username}/upload`,
        formData
      );
      setBlog({ ...blog, banner: response.urls[0] });
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
  // publish blog on clicking publish button
  const handlePublishEvent = async () => {
    if (!banner.length || !title.length) {
      return toast.error("Please fill all the fields");
    }
    try {
      const data = await textEditor.save();
      if (data.blocks.length) {
        setBlog({ ...blog, content: data });
        seteditorState("publish");
      } else {
        toast.error("Write something in your blog to publish it.");
      }
    } catch (error) {
      console.error("Error saving blog content:", error);
      toast.error("Error saving blog content.");
    }
  };
  // Function for Saving draft of a blog
  const saveDraft = async () => {
    if (!title.length) {
      toast.error("Write a title to save draft");
    } else if (desc.length > 200) {
      toast.error("Description is too long. Maximum length is 200 characters.");
    } else {
      const loadingToast = toast.loading("Saving blog...");

      const blogData = { title, banner, desc, tags, content, draft: true };
      try {
        await apiPost(`/${auth.user.username}/create-blog`, blogData);
        toast.dismiss(loadingToast);
        toast.success("Blog Saved successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Error saving blog.");
      }
    }
  };

  // Default image handling
  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  useEffect(() => {
    setTextEditor(
      new EditorJs({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      })
    );
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="auth-btn py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button onClick={saveDraft} className="auth-btn py-2">
            Save Draft
          </button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section className="w-full">
          <div className="mx-auto max-w-[900px] w-full p-5">
            <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-zinc-200">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  onError={handleError}
                  className="z-20"
                  alt=""
                />
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
              defaultValue={title}
            ></textarea>
            <hr className="w-full" />
            <hr className="w-full opacity-10 my-5" />
            <div id="textEditor"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
