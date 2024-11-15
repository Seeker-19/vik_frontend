import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context, server } from "../main.jsx";

import CarGallery from "./CarGallery.jsx"; // Updated for cars

const CarFront = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const { setUser } = useContext(Context);
  const history = useNavigate();
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${server}/vehicle/car/${id}`, { withCredentials: true })
      .then((response) => {
        setCar(response.data.car);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data?.message === "First Login") {
          history("/");
        }
      });
  }, [id]);

  const getComp = () => {
    return (
      <div className="bg-black text-white absolute inset-0 min-h-screen">
        <div className="p-8 grid gap-8 bg-black">
          <div className="p-4">
            <h2 className="text-3xl">Photos of {car?.model}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-12 flex gap-1 py-2 px-4 rounded-2xl text-black bg-white shadow shadow-black"
            >
              Close Photos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {car?.photos.length > 0 &&
            car.photos.map((photo, index) => (
              <div key={index} className="w-full">
                <img
                  src={photo}
                  className="min-w-full"
                  alt={`Car ${index + 1}`}
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {!showAllPhotos && (
        <div className="mt-4 -mx-4 px-8 pt-8 bg-gray-100">
          <h1 className="text-3xl">Model: {car?.model}</h1>
          <h2 className="text-black font-bold mt-1">
            License Id: {car?.licensePlate}
          </h2>
          <h3 className="text-black font-bold">{car?.make}</h3>

          <CarGallery
            car={car}
            showAllPhotos={showAllPhotos}
            setShowAllPhotos={setShowAllPhotos}
          />

          <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="my-4">
                <h2 className="font-bold text-2xl">Description</h2>
                {car?.description}
              </div>
            </div>
          </div>

          <div className="bg-white -mx-8 px-8 py-8 border-t">
            {
              <>
                <div>
                  <h2 className="font-semibold text-2xl">Extra Info</h2>
                </div>
                <div className="mt-2 text-sm text-gray-700 leading-6">
                  Mileage:{car?.mileage}
                </div>
                <div className="mt-2 text-sm text-gray-700 leading-6">
                  Manufacturing year:{car?.year}
                </div>
              </>
            }
          </div>
        </div>
      )}
      {showAllPhotos && getComp()}
    </>
  );
};

export default CarFront;
