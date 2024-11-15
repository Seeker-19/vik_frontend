import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AccountNav from "./AccountNav.jsx";
import { Context } from "../main.jsx";
import axios from "axios";
import { server } from "../main.jsx";
import toast from "react-hot-toast";
import CarImg from "./CarImg.jsx"; // Updated component to render car images
import { MdDelete } from "react-icons/md";

const CarsPage = () => {
  const history = useNavigate();
  const { setUser } = useContext(Context);
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getCars = async () => {
    try {
      const { data } = await axios.get(`${server}/vehicle/mycars`, {
        withCredentials: true,
      });

      console.log(data.cars);
      setRefresh(true);
      setCars(data.cars);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message === "First Login") {
        history("/");
      }
    }
  };

  useEffect(() => {
    getCars();
  }, [refresh]);

  console.log(cars);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          to={"/account/cars/new"}
          className="inline-flex bg-primary gap-2 text-white py-2 px-6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add New Cars
        </Link>
      </div>
      <div>
        {cars.length > 0 &&
          cars.map((car) => (
            <Link
              to={"/account/cars/" + car._id}
              key={car._id}
              className="bg-gray-200 mt-3 cursor-pointer flex gap-4 p-4 rounded-2xl"
            >
              <div className="cursor-pointer flex gap-3 rounded-2xl items-center w-full">
                <div className="bg-gray-300 w-32 h-32 flex shrink-0">
                  <CarImg car={car} />
                </div>

                <div className="grow-0 shrink">
                  <h2 className="text-xl">Model: {car.model}</h2>
                  <h2 className="text-xl mt-2">
                    Manufacturing Year: {car.year}
                  </h2>
                  <p className="text-sm mt-3">Description: {car.description}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CarsPage;
