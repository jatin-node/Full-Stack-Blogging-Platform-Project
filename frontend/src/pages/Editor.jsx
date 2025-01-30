import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; 
import { AuthContext } from "../context/AuthContext";
import BlogEditor from "../components/BlogEditor";
import Publishform from "../components/Publishform";
import { Toaster } from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

const blogEditor = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  desc: "",
  author: { personalInfo: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blogId } = useParams();

  const [blog, setBlog] = useState(blogEditor);
  const [editorState, seteditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setloading] = useState(true);

  const { auth } = useContext(AuthContext);
  // const user = auth?.user?.username;

  // Reset form function
  const resetForm = () => {
    seteditorState("editor");
    setBlog({
      title: "",
      banner: "",
      content: [],
      tags: [],
      desc: "",
      author: { personalInfo: {} },
    });
  };

  // const fetchData = async () => {
  //   if (user) {
  //     try {
  //       const response = await apiGet(`/${user}/editor`);
  //       console.log(response);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  // };

  const fetchBlog = () => {
    axios.post(import.meta.env.VITE_BACKEND_URL + "/blog/get-blog", {
      blogId, draft: true, mode: 'edit'
    })
    .then(({ data: { blog } }) => {
      console.log(blog);
      setBlog(blog);
      setloading(false);
    })
    .catch(err => {
      console.log(err);
      setBlog(null);
      setloading(false);
    });
  };

  useEffect(() => {
    // fetchData();

    if (!blogId) {
      return setloading(false);
    }

    fetchBlog();
  }, [blogId]);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        seteditorState,
        textEditor,
        setTextEditor,
        resetForm,
      }}
    >
      <Toaster />
      {auth.token ? (
        loading ? (
          <div>Loading...</div>
        ) : editorState === "editor" ? (
          <BlogEditor />
        ) : (
          <Publishform />
        )
      ) : (
        <Navigate to="/sign-in" />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
