import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import axios from "axios";
import { server } from "../main";
import Loader from "./Loader.jsx";
import _ from "lodash";

const IndexPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getCars = async (query = "") => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${server}/vehicle/allcars`, {
        params: { query },
      });

      setCars(data.cars);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const debouncedGetCars = useCallback(
    _.debounce((query) => getCars(query), 1000),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedGetCars(searchQuery);
    } else {
      getCars();
    }
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by car model or license plate..."
        className="border p-2 rounded mb-4"
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-x-6 gap-y-8 mt-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto mb-10">
          {cars.length > 0 &&
            cars.map((car) => (
              <Link to={`car/${car._id}`} key={car._id}>
                <div className="bg-gray-300 mb-2 rounded-2xl flex h-[16rem] md:h-[20rem] w-full">
                  {car?.photos[0] && (
                    <img
                      className="rounded-2xl object-cover aspect-square w-full h-full"
                      src={car?.photos[0]}
                      alt={`${car.title} image`}
                    />
                  )}
                </div>
                <h2 className="font-bold">
                  {car.make} {car.model}
                </h2>
                <h3 className="text-sm text-gray-500">{car.title}</h3>
                <div className="text-sm text-gray-400">
                  License: {car.licensePlate}
                </div>
                <div className="mt-1">
                  <span className="font-bold">{car.year}</span> | {car.mileage}{" "}
                  km
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
