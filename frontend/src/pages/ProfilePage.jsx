import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiPost } from "../utils/api";
import AnimationWrapper from "../components/AnimationWrapper";
import { AuthContext } from "../context/AuthContext";
import AboutUser from "../components/AboutUser";
import InPageNavigation from "../components/InPageNavigation";
import BlogCard from "../components/BlogCard";
import NoDataMessage from "../components/NoDataMessage";
import PageNotFound from "../components/PageNotFound";

export const profileDataStructure = {
  personalInfo: {
    Fullname: "",
    email: "",
    bio: "",
    username: "",
    profile_img: "",
  },
  accountInfo: {
    total_posts: 0,
    total_reads: 0,
  },
  joinedAt: "",
};

const ProfilePage = () => {
  let { id: ProfileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);

  let {
    personalInfo: {
      Fullname,
      bio,
      email,
      username: profile_username,
      profile_img,
    } = {},
    accountInfo: { total_posts, total_reads } = {},
    joinedAt,
  } = profile || {};

  let { auth } = useContext(AuthContext);

  const fetchUserProfile = async () => {
    const response = await apiPost("/get-profile", { username: ProfileId });
    if (response.user) {
      setProfile(response.user);
      getBlogs({ user_id: response.user._id });
    }
    setLoading(false);
  };

  const getBlogs = async ({ user_id }) => {
    user_id = user_id === undefined ? ProfileId : user_id;

    const response = await apiPost("/search-blogs", { author: user_id });
    response.user_id = user_id;
    setBlogs(response.blogs);
  };

  useEffect(() => {
    resetStates();
    fetchUserProfile();
  }, [ProfileId]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : profile?.personalInfo?.username?.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12 md:px-28">
          <div className="flex flex-col items-center gap-5 min-w-[250px] md-w-[50%] md:pl-8 md:mt-5 md:border-l border-zinc-200 md:sticky md:top-0 md:py-10">
            <img
              src={profile_img}
              className="w-48 h-48 bg-zinc-100 rounded-full md:w-32 md:h-32"
              alt={profile_img}
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{Fullname}</p>
            <p>
              {total_posts?.toLocaleString()} Blogs -{" "}
              {total_reads?.toLocaleString()} reads
            </p>
            <div className="flex gap-4 mt-2">
              {
                // Edit button
                ProfileId === auth?.user?.username ? (
                  <Link
                    to="/settings/edit/profile"
                    className="px-4 py-3 rounded-md bg-zinc-200"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  ""
                )
              }
            </div>
            <AboutUser
              className="max-md:hidden"
              bio={bio}
              joinedAt={joinedAt}
            />
          </div>

          <div className="h-cover max-md:mt-12 w-full max-md:px-2">
            <InPageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {
                  // latest blogs
                  blogs === null ? (
                    <h1>Loading...</h1>
                  ) : blogs.length ? (
                    blogs.map((blog, index) => {
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

              <AboutUser bio={bio} joinedAt={joinedAt} />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
