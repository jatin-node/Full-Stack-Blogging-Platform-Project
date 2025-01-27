import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiPost } from "../utils/api";
import AnimationWrapper from "../components/AnimationWrapper";
import { AuthContext } from "../context/AuthContext";
import AboutUser from "../components/AboutUser";

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

  let {
    personalInfo: {
      Fullname,
      bio,
      email,
      username: profile_username,
      profile_image,
    },
    accountInfo: { total_posts, total_reads },
    joinedAt
  } = profile;

  let { auth } = useContext(AuthContext);

  const fetchUserProfile = async () => {
    const response = await apiPost("/get-profile", { username: ProfileId });
    console.log(response.user);
    setProfile(response.user);
    setLoading(false);
  };

  useEffect(() => {
    resetStates();
    fetchUserProfile();
  }, [ProfileId]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-center gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
            <img
              src={profile_image}
              className="w-48 h-48 bg-zinc-100 rounded-full md:w-32 md:h-32"
              alt={profile_image}
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{Fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} reads
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
            <AboutUser className="max-md:hidden" bio={bio} joinedAt={joinedAt} />
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
