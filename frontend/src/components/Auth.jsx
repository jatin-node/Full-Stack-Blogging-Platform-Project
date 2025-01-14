import React, { useState } from "react";
import InputBox from "./InputBox";
import { Link } from "react-router-dom";
import googlelogo from "../assets/google-logo.png";
import AnimationWrapper from "./AnimationWrapper";

const Auth = ({ type }) => {
  const [islock, setislock] = useState(true);
  return (
    <AnimationWrapper type={type}>
      <section className="flex justify-center items-center pt-[100px]">
        <div className="w-[85%] max-w-[500px] bg-white">
          <form className="w-full flex flex-col items-center gap-5">
            <h1 className="flex mb-10 justify-center text-4xl capitalize font-bold text-center">
              {type ? "Create Account" : "Welcome Back"}
            </h1>
            {type ? (
              //  Sign in Form
              <>
                <InputBox
                  type="text"
                  placeholder="User Name"
                  name="Username"
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
                <Link className="px-6 py-3 bg-zinc-800 hover:bg-black text-white rounded-full">
                  Sign Up
                </Link>

                <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
                  <hr className="w-1/2 border-black" />
                  <p>or</p>
                  <hr className="w-1/2 border-black" />
                </div>

                <Link className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2">
                  <img src={googlelogo} alt="" />
                  <span>Contiune with Google</span>
                </Link>

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
                  type="text"
                  placeholder="User Name"
                  name="Username"
                  className="fi fi-rr-user"
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
                <Link className="px-6 py-3 bg-zinc-800 hover:bg-black text-white rounded-full">
                  Log In
                </Link>

                <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
                  <hr className="w-1/2 border-black" />
                  <p>or</p>
                  <hr className="w-1/2 border-black" />
                </div>

                <Link className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2">
                  <img src={googlelogo} alt="" />
                  <span>Contiune with Google</span>
                </Link>

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
