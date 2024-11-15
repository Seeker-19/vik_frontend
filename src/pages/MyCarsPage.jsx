import React, { useContext, useEffect, useState, useCallback } from "react";
import AccountNav from "./AccountNav.jsx";
import { Context, server } from "../main.jsx";
import axios from "axios";
import Loader from "./Loader.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import _ from "lodash";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const MyCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(Context);

  const history = useNavigate();

  const getCars = async (query = "") => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${server}/vehicle/mycars`, {
        withCredentials: true,
      });

      setCars(data.cars);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching cars");
      if (error.response?.data?.message === "First Login") {
        history("/");
      }
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const { data } = await axios.delete(`${server}/vehicle/deleteCar/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      getCars();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting car");
      if (error.response?.data?.message === "First Login") {
        history("/");
      }
    }
  };

  return (
    <div>
      <AccountNav />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {cars &&
              cars.length > 0 &&
              cars.map((car) => (
                <Link
                  className="flex flex-grow gap-4 bg-gray-200 rounded-2xl overflow-hidden"
                  key={car._id}
                  to={`/car/${car._id}`}
                >
                  <div className="flex w-48">
                    <img
                      src={car.photos[0]}
                      alt={car.photos[0]}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="py-3 w-full">
                    <h2 className="text-xl">{car.licensePlate}</h2>
                    <div className="lg:text-xl text-sm">
                      <div className="flex justify-between gap-1 mt-1">
                        <div className="flex flex-col gap-5">
                          <span className="text-sm lg:text-lg">
                            <span className="text-black  font-bold">Make:</span>{" "}
                            {car.make}
                          </span>
                          <span className="text-sm lg:text-lg">
                            <span className="text-black  font-bold">
                              Model:
                            </span>{" "}
                            {car.model}
                          </span>
                          <span className="text-sm lg:text-lg">
                            <span className="text-black  font-bold">
                              Manufacturing year:
                            </span>{" "}
                            {car.year}
                          </span>
                        </div>
                        <div className="p-2 items-center">
                          <MdDelete
                            size={26}
                            onClick={(e) => handleDelete(car._id, e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyCarsPage;
