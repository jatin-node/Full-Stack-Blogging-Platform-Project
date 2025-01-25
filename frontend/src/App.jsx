import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/Auth";
import Editor from "./pages/Editor";

function App() {
  return (
      <div className="">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/sign-in" element={<Auth type={true} />} />
            <Route path="/log-in" element={<Auth type={false} />} />
            <Route path="/log-out" element={<Home />} />
          </Route>
          <Route path="/:user/editor" element={<Editor />}/>
        </Routes>
      </div>
  );
}

export default App;
