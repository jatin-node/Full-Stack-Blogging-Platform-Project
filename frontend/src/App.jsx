import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/Auth";
import Editor from "./pages/Editor";
import SearchPage from "./pages/SearchPage";
import Navbar from "./components/Navbar";
import PageNotFound from "./components/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";

function App() {
  const location = useLocation();
  const hideNavbar = matchPath({ path: "/:user/editor", end: true }, location.pathname) ||
                     matchPath({ path: "/:user/editor/:blogId", end: true }, location.pathname);

  return (
      <div className="">
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Auth type={true} />} />
          <Route path="/log-in" element={<Auth type={false} />} />
          <Route path="/log-out" element={<Home />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/:user/editor" element={<Editor />}/>
          <Route path="/:user/editor/:blogId" element={<Editor />}/>
          <Route path="/user/:id" element={<ProfilePage/>}/>
          <Route path="/blog/:blogId" element={<BlogPage/>} />
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </div>
  );
}

export default App;
