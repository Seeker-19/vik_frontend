import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getToken } from "../api";
import { useEffect } from "react";
import { FaCar } from "react-icons/fa";

const AccountNav = () => {
  const path = useLocation();
  const { pathname } = path;

  console.log(path);
  console.log(pathname);
  let subpage = pathname.split("/")?.[2] || null;

  if (subpage === null) {
    subpage = "profile";
  }
  console.log(subpage);

  function linkClasses(type = null) {
    let classes = "inline-flex gap-2 px-6 py-2 rounded-full";

    if (type === subpage) {
      classes += " link bg-primary text-white ";
    } else {
      classes += " link bg-gray-200";
    }

    return classes;
  }

  return (
    <>
      <nav className="w-full flex mt-10 mb-10 gap-8 items-center justify-center">
        <Link className={linkClasses("profile")} to={"/account"}>
          <p className="text-sm lg:text-xl">My profile</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <Link className={linkClasses("cars")} to={"/account/cars"}>
          <span className="text-sm lg:text-lg">Update/Add Cars</span>{" "}
          <FaCar className="text-xl" />
        </Link>

        <Link className={linkClasses("mycars")} to={"/account/mycars"}>
          <span className="text-sm lg:text-lg">View My Cars</span>{" "}
          <FaCar className="text-xl" />
        </Link>
      </nav>
    </>
  );
};

export default AccountNav;
