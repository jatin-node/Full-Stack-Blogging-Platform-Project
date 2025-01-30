import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation";
import AnimationWrapper from "../components/AnimationWrapper";
import BlogCard from "../components/BlogCard";
import NoDataMessage from "../components/NoDataMessage";
import { apiPost } from "../utils/api";
import UserCard from "../components/UserCard";

const SearchPage = () => {
  let { query } = useParams();
  const [blog, setBlog] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = async () => {
    const response = await apiPost("/search-blogs", { query });
    // console.log(response.blogs);
    setBlog(response.blogs);
  };

  const searchUsers = async () => {
    const response = await apiPost("/search-users", { query });
    // console.log(response.users);
    setUsers(response.users);
  };

  useEffect(() => {
    resetBlog();
    searchBlogs();
    searchUsers();
  }, [ query ]);

  const resetBlog = () => {
    setBlog(null);
    setUsers(null);
  };

  // mobile view users card
  const UserCardWrapper = (user, index) => {
    return (
      <AnimationWrapper
        key={index}
        transition={{ duration: 1, delay: index * 0.1 }}
      >
        {
            users === null ? (
                <h1>Loading...</h1>
            ) : users.length ? (
                users.map((user, index) => {
                return <UserCard key={index} data={user} />
                })
            ) : (
                <NoDataMessage message={"No users found"} />
            )
        }
      </AnimationWrapper>
    );
  }

  return (
    <section className="h-cover pt-5 mx-5 md:mx-20 lg:mx-36 flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[
            `Search results for "${query}"`,
            "Account matching search query",
          ]}
          defaultHidden={["Account matching search query"]}
        >
          <>
            {blog === null ? (
              <h1>Loading...</h1>
            ) : blog.length ? (
              blog.map((blog, index) => {
                return (
                  <AnimationWrapper
                    key={index}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  >
                    <BlogCard blog={blog} author={blog.author.personalInfo} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message={"No blogs published"} />
            )}
          </>
          <UserCardWrapper />
        </InPageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-zinc-200 pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-lg mb-8 flex items-center gap-2 ">
            <span>User related to Search</span>
            <i className="fi fi-rr-user mt-1"></i>
        </h1>
            <UserCardWrapper />
        
      </div>
    </section>
  );
};

export default SearchPage;
