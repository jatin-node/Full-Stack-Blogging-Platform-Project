import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import BlogEditor from "../components/BlogEditor";
import Publishform from "../components/Publishform";

const Editor = () => {
  const [editorState, seteditorState] = useState("editor");
  const { auth } = useContext(AuthContext);
  const user = auth?.user?.username;
  const fetchData = async () => {
    if (user) {
      const response = await apiGet(`/${user}/editor`);
      console.log(response);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return auth.token ? (
    editorState === "editor" ? (
      <BlogEditor />
    ) : (
      <Publishform />
    )
  ) : (
    <div>Sign-in required</div>
  );
};

export default Editor;
