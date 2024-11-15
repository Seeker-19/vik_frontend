import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context, server } from "./main.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./pages/Loader.jsx";
import { getToken } from "./api.js";
const Header = () => {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  } = useContext(Context);

  const history = useNavigate();

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });

      console.log(data);

      toast.success("Logged out successfully");

      setUser(null);
      setIsAuthenticated(false);

      history("/");
    } catch (error) {
      setIsAuthenticated(true);
      console.log(error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      let isToken = await getToken();
      if (!isToken) {
        //history("/");
        setUser(null);
      }
    };

    checkToken();
  }, [history]);

  // useEffect(() => {
  //   console.log("useeffect");
  // }, [user]);

  return (
    <div>
      <header className=" mt-2 flex justify-between">
        <Link to={"/"} className="flex items-center gap-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 -rotate-90"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>

          <span className="font-bold text-sm lg:text-xl">
            My Car Collection
          </span>
        </Link>

        <div className="lg:flex gap-2 border border-gray-300 rounded-full hidden py-2 px-4 shadow-md shadow-gray-400">
          <div>Add To Collection</div>
          <div className="border-l border-gray-300"></div>

          <button className="bg-primary text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          <div>{user ? user.name : null}</div>

          <Link
            to={user ? "/account" : "/login"}
            className="bg-gray-500 text-white rounded-full border border-gray-700 overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 relative top-1"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <div onClick={logoutHandler}>
            {user ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
