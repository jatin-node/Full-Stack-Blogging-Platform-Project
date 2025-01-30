import React, { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "./AnimationWrapper";
import { EditorContext } from "../pages/Editor";
import Tag from "./Tag";
import { apiPost } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const Publishform = () => {
  let characterlimit = 200;
  const tagsLimit = 10;

  let { blogId } = useParams();

  const { auth } = useContext(AuthContext);
  let {
    blog: { title, banner, desc, tags, content, draft }, blog, setBlog, seteditorState, resetForm } = useContext(EditorContext);

  const handleCloseEvent = () => {
    seteditorState("editor");
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      addTag(e.target.value);
      e.target.value = "";
    }
  };

  // Add tag function
  const addTag = (tag) => {
    if (tags.length < tagsLimit && !tags.includes(tag) && tag.length) {
      setBlog({ ...blog, tags: [...tags, tag] });
    } else {
      toast.error("You can only add up to 10 tags.");
    }
  };
  
  // Publish blog function
  const handlePublish = async () => {
    if (tags.length < 1) {
      toast.error("Add at least one tag");
      return;
    }
    const loadingToast = toast.loading("Publishing blog...");
    const blogData = { title, banner, desc, tags, content, draft: false };
    await apiPost(`/${auth.user.username}/create-blog`, {...blogData, id: blogId});
    toast.dismiss(loadingToast);
    toast.success("Blog published successfully!");
    resetForm();
  };

  const handleBlogtitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDescrptionChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, desc: input.value });
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 px-5 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="block mx-auto max-w-[550px]">
          <p className="text-lg font-bold text-zinc-400">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-500 mt-4">
            <img src={banner} alt="Banner" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="text-xl font-medium mt-4 leading-7 line-clamp-2">
            {desc}
          </p>
        </div>

        <div className="border-zinc-400 lg:border-l lg:pl-8">
          <p className="text-zinc-400 mb-2 mt-9">Blog title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            onChange={handleBlogtitleChange}
            className="w-full lg:w-[70%] rounded-md p-4 bg-zinc-200 pl-4 border border-zinc-200 focus:bg-transparent placeholder:text-black"
          />

          <p className="text-zinc-400 mb-2 mt-9">
            Short Description about your Blog
          </p>
          <textarea
            maxLength={characterlimit}
            defaultValue={desc}
            className="h-40 lg:w-[70%] resize-none leading-7 w-full rounded-md p-4 bg-zinc-200 pl-4 border border-zinc-200 focus:bg-transparent placeholder:text-black"
            onChange={handleBlogDescrptionChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>
          <p className="mt-1 lg:w-[70%] text-zinc-400 text-sm text-right">
            {characterlimit - desc.length} characters left
          </p>

          <p className="text-zinc-400 mb-2 mt-9">Topics-(helps in searching)</p>
          <div className="relative px-2 py-2 pb-4 bg-zinc-200 rounded-md w-full lg:w-[70%]">
            <input
              type="text"
              placeholder="Topic"
              className="sticky top-0 left-0 border-2 w-full outline-none rounded-md px-5 py-2"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
            <p className="mt-1 text-zinc-400 text-right">
              {tagsLimit - tags.length} tags left
            </p>
          </div>
          <button
            onClick={handlePublish}
            className="auth-btn mt-4 rounded-full px-8"
          >
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Publishform;
