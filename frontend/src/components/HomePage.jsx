import React, { useEffect, useState } from "react";
import InPageNavigation from "./InPageNavigation";
import AnimationWrapper from "./AnimationWrapper";
import { apiGet, apiPost } from "../utils/api";
import BlogCard from "./BlogCard";
import BlogPost from "./BlogPost";
import { activeTabRef } from "./InPageNavigation";
import NoDataMessage from "./NoDataMessage";

const HomePage = () => {
  const [blog, setBlog] = useState(null);
  const [trendingBlog, setTrendingBlog] = useState(null);
  const [pageState, setPageState] = useState("home");

  let categories = [
    "nature",
    "forest",
    "animals",
    "mountains",
    "space",
    "ocean",
    "technology",
    "camping",
    "photography",
    "fashion",
    "research",
    "travel"
  ];

  const loadBlogByCategory = async (e) => {
    const category = e.target.innerText;
    setBlog(null);
    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  const fetchLatestBlogs = async () => {
    const response = await apiGet("/latest-blogs");
    setBlog(response.blogs);
  };
  const fetchBlogCategory = async () => {
    const response = await apiPost("/search-blogs", { tag: pageState });
    setBlog(response.blogs);
  };

  const fetchTrendingBlogs = async () => {
    const response = await apiGet("/trending-blogs");
    setTrendingBlog(response.blogs);
  };
  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogCategory();
    }
    if (!trendingBlog) {
      fetchTrendingBlogs();
    }
  }, [pageState]);
  return (
    <AnimationWrapper>
      <section className="h-cover pt-5 mx-5 md:mx-20 lg:mx-36 flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {
                // latest blogs
                blog === null ? (
                  <h1>Loading...</h1>
                ) : blog.length ? (
                  blog.map((blog, index) => {
                    return (
                      <AnimationWrapper
                        key={index}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      >
                        <BlogCard
                          blog={blog}
                          author={blog.author.personalInfo}
                        />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message={"No blogs published"} />
                )
              }
            </>

            {
              // trending blogs
              trendingBlog === null ? (
                <h1>Loading...</h1>
              ) : trendingBlog.length ? (
                trendingBlog.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      key={index}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <BlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message={"No blogs published"} />
              )
            }
          </InPageNavigation>
        </div>
        {/* trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-zinc-200 pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <h1 className="font-medium text-xl flex  items-center gap-2">
              <span>Filters</span>
              <i className="fi fi-rr-filter-list"></i>
            </h1>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, index) => {
                return (
                  <button
                    key={index}
                    className={` text-black px-4 py-2 rounded-full ${
                      pageState === category
                        ? "bg-black text-white"
                        : "bg-zinc-200"
                    }`}
                    onClick={loadBlogByCategory}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h1 className="font-medium text-xl my-8 flex items-center gap-1">
              <span>Trending</span>
              <i className="fi fi-rr-arrow-trend-up"></i>
            </h1>
            {
              // trending blogs
              trendingBlog === null ? (
                <h1>Loading...</h1>
              ) : (
                trendingBlog.length ? 
                trendingBlog.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      key={index}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <BlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  );
                }) : (
                  <NoDataMessage message={"No blogs published"}/>
                )
              )
            }
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
