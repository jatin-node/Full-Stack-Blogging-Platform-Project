import React, { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "./AnimationWrapper";
import { EditorContext } from "../pages/Editor";
import Tag from "./Tag";
import { apiPost } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Publishform = () => {
  const tagsLimit = 10;
  const { auth } = useContext(AuthContext);
  const {
    blog: { title, banner, desc, tags, draft },
    blog,
    setBlog,
    seteditorState,
    resetForm,
  } = useContext(EditorContext);

  const handleCloseEvent = () => {
    seteditorState("editor");
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

    const blogData = { title, banner, desc, tags, draft: false };
    await apiPost(`/${auth.user.username}/create-blog`, blogData);
    toast.dismiss(loadingToast);
    toast.success("Blog published successfully!");
    resetForm();
  };


  return (
    <AnimationWrapper>
      <section className="h-full">
        <Toaster />
        <button
          className="w-12 h-12 absolute top-[1.5vh] right-[5vw] z-10"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="flex flex-col lg:flex-row">
          <div className="mx-auto max-w-[900px] w-full p-5 flex flex-col justify-center">
            <p className="text-lg font-bold text-red-500">Preview</p>
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
          <div className="mx-auto max-w-[900px] w-full p-5 flex flex-col justify-center items-start">
            <p className="text-zinc-400 mb-2 mt-9">
              Topics-(helps in searching)
            </p>
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
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Publishform;
