import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../utils/api";
import AnimationWrapper from "../components/AnimationWrapper";
import GetDay from "../components/GetDay";
import BlogInteraction from "../components/BlogInteraction";
import BlogCard from "../components/BlogCard"
import axios from "axios";

export const blogStructure = {
  title: "",
  banner: "",
  desc: "",
  author: { personalInfo: {} },
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);

  let { title, banner, desc, author: { personalInfo: { Fullname, username: author_username, profile_img } }, publishedAt } = blog;

  const fetchBlog = () => {
    axios.post(import.meta.env.VITE_BACKEND_URL + "/blog/get-blog", { blogId })
      .then(({ data: { blog } }) => {
        setBlog(blog);

        axios.post(import.meta.env.VITE_BACKEND_URL + "/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blogId })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);

          });

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blogId]);

  const resetStates = ()=>{
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <BlogContext.Provider value={{ blog, setBlog }}>
          <div className="max-w-[900px] block mx-auto py-10 max-lg:px-[5vw] ">
            <img src={banner} className="aspect-video" alt="" />
            <div className="mt-12">
              <h2>{title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    className="w-12 h-12 rounded-full"
                    alt=""
                  />
                  <p>
                    {Fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-zinc-400 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {GetDay(publishedAt)}
                </p>
              </div>
            </div>
            <BlogInteraction />

            {/* blog content will go here */}

            <BlogInteraction />

            {similarBlogs !== null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                {similarBlogs.map((blog, i) => {
                  let { author: { personalInfo } } = blog;
                  return (
                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                      <BlogCard blog={blog} author={personalInfo} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : ""}

            
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
