import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/Auth";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/sign-in" element={<Auth type={true} />} />
            <Route path="/log-in" element={<Auth type={false} />} />
            <Route path="/log-out" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
