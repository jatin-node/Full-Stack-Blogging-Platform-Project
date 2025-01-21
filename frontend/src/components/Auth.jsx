import React, { useRef, useState, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import InputBox from "./InputBox";
import { Link, useNavigate } from "react-router-dom";
import googlelogo from "../assets/google-logo.png";
import AnimationWrapper from "./AnimationWrapper";
import { emailRegex, nameRegex, passwordRegex } from "../utils/validation";
import { AuthContext } from "../context/AuthContext";
import { apiPost } from "../utils/api"; // Import the utility function

const Auth = ({ type }) => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [islock, setislock] = useState(true);
  const signInForm = useRef();
  const logInForm = useRef();

  const serverConnect = async (endpoint, formData) => {
    try {
      const response = await apiPost(endpoint, formData);
      const { token, user } = response;
      setAuth({ token, user });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || error.message);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const endpoint = type ? "/sign-in" : "/log-in";

    const formData = {
      email: type
        ? signInForm.current.elements.email.value
        : logInForm.current.elements.email.value,
      Password: type
        ? signInForm.current.elements.Password.value
        : logInForm.current.elements.Password.value,
    };
    if (type) {
      formData.Fullname = signInForm.current.elements.Fullname.value;
      if (!nameRegex.test(formData.Fullname)) {
        return toast.error("Name is Invalid");
      }
    }

    if (!formData.email) {
      return toast.error("Enter email");
    }
    if (!formData.Password) {
      return toast.error("Enter password");
    }
    if (type && !formData.Fullname) {
      return toast.error("Enter Full Name");
    }

    if (!emailRegex.test(formData.email)) {
      return toast.error("Invalid email format");
    }
    if (!passwordRegex.test(formData.Password)) {
      return toast.error(
        "Password should be 7 to 20 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
    }

    serverConnect(endpoint, formData);
  };

  return (
    <AnimationWrapper type={type}>
      <section className="flex justify-center items-center pt-[100px]">
        <div className="w-[85%] max-w-[500px] bg-white">
          <Toaster />
          <form
            ref={type ? signInForm : logInForm}
            className="w-full flex flex-col items-center gap-5"
          >
            <h1 className="flex mb-10 justify-center text-4xl capitalize font-bold text-center">
              {type ? "Create Account" : "Welcome Back"}
            </h1>
            {type ? (
              //  Sign in Form
              <>
                <InputBox
                  type="text"
                  placeholder="Full Name"
                  name="Fullname"
                  className="fi fi-rr-user"
                />
                <InputBox
                  type="email"
                  placeholder="email@gmail.com"
                  name="email"
                  className="fi fi-rr-envelope"
                />
                <div className="w-full relative">
                  <InputBox
                    type={`${islock ? "password" : "text"}`}
                    placeholder="Password"
                    name="Password"
                    className="fi fi-rr-lock"
                  />
                  <i
                    onClick={() => setislock(!islock)}
                    className={`absolute top-3 right-4 cursor-pointer ${
                      islock ? "fi fi-br-eye-crossed" : "fi fi-br-eye"
                    }`}
                  ></i>
                </div>
                <button
                  onClick={handlesubmit}
                  className="px-6 py-3 bg-zinc-800 hover:bg-black text-white rounded-full"
                >
                  Sign Up
                </button>

                <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
                  <hr className="w-1/2 border-black" />
                  <p>or</p>
                  <hr className="w-1/2 border-black" />
                </div>

                <button className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2">
                  <img src={googlelogo} alt="" />
                  <span>Contiune with Google</span>
                </button>

                <div>
                  Already have an account&nbsp;
                  <Link to="/log-in" className="text-blue-600 underline ">
                    log in
                  </Link>
                </div>
              </>
            ) : (
              //  Log in Form
              <>
                <InputBox
                  type="email"
                  placeholder="email@gmail.com"
                  name="email"
                  className="fi fi-rr-envelope"
                />
                <div className="w-full relative">
                  <InputBox
                    type={`${islock ? "password" : "text"}`}
                    placeholder="Password"
                    name="Password"
                    className="fi fi-rr-lock"
                  />
                  <i
                    onClick={() => setislock(!islock)}
                    className={`absolute top-3 right-4 cursor-pointer ${
                      islock ? "fi fi-br-eye-crossed" : "fi fi-br-eye"
                    }`}
                  ></i>
                </div>
                <button
                  onClick={handlesubmit}
                  className="px-6 py-3 bg-zinc-800 hover:bg-black text-white rounded-full"
                >
                  Log In
                </button>

                <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
                  <hr className="w-1/2 border-black" />
                  <p>or</p>
                  <hr className="w-1/2 border-black" />
                </div>

                <button className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2">
                  <img src={googlelogo} alt="" />
                  <span>Contiune with Google</span>
                </button>

                <div>
                  Don't have an account&nbsp;
                  <Link to="/sign-in" className="text-blue-600 underline ">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Auth;
