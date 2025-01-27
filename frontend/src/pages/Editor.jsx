import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import BlogEditor from "../components/BlogEditor";
import Publishform from "../components/Publishform";
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
  const [blog, setBlog] = useState(blogEditor);
  const [editorState, seteditorState] = useState("editor");
  const { auth } = useContext(AuthContext);
  const user = auth?.user?.username;

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

  const fetchData = async () => {
    if (user) {
      try {
        const response = await apiGet(`/${user}/editor`);
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <EditorContext.Provider
      value={{ blog, setBlog, editorState, seteditorState, resetForm }}
    >
      {auth.token ? (
        editorState === "editor" ? (
          <BlogEditor />
        ) : (
          <Publishform />
        )
      ) : (
        <div>Sign-in required</div>
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
