import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context, server } from "../main.jsx";
import toast from "react-hot-toast";
import PhotosUploader from "./PhotosUploader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import AccountNav from "./AccountNav.jsx";
import Perks from "./Perks.jsx";

const CarForm = () => {
  const { setUser } = useContext(Context);
  const [loading, setLoading] = useState(false);

  // Car-specific fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]); // Similar to perks
  const [extraInfo, setExtraInfo] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState(1000); // Default price
  const [licensePlate, setLicensePlate] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const inputHeader = (text) => (
    <h2 className="inline-block mt-5 text-2xl font-bold">{text}</h2>
  );

  const inputDescription = (text) => (
    <p className="text-gray-500 text-sm">{text}</p>
  );

  const preInput = (header, description) => (
    <>
      {inputHeader(header)}
      {inputDescription(description)}
    </>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carData = {
      make,
      model,
      year,
      photos: addedPhotos,
      description,
      features,
      extraInfo,
      mileage,
      price,
      licensePlate,
    };

    try {
      setLoading(true);

      const { data } = id
        ? await axios.put(`${server}/vehicle/car/${id}`, carData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
        : await axios.post(`${server}/vehicle/newcar`, carData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });

      toast.success(data.message);
      setLoading(false);
      navigate("/account/cars");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
      if (error.response?.data?.message === "First Login") {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${server}/vehicle/car/${id}`, { withCredentials: true })
      .then(({ data }) => {
        const {
          make,
          model,
          year,
          photos,
          description,
          features,
          extraInfo,
          mileage,
          price,
          licensePlate,
        } = data.car;

        setMake(make || "");
        setModel(model || "");
        setYear(year || "");
        setAddedPhotos(photos || []);
        setDescription(description || "");
        setFeatures(features || []);
        setExtraInfo(extraInfo || "");
        setMileage(mileage || "");
        setPrice(price || 1000);
        setLicensePlate(licensePlate || "");
      })
      .catch((error) => {
        if (error.response?.data?.message === "First Login") {
          navigate("/");
        }
      });
  }, [id]);

  return (
    <>
      <AccountNav />
      <form onSubmit={handleSubmit}>
        {preInput("Car Make", "Enter the manufacturer (e.g., Toyota, Ford)")}
        <input
          required
          type="text"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Make (e.g., Toyota)"
        />

        {preInput("Car Model", "Enter the model (e.g., Corolla, Mustang)")}
        <input
          required
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model (e.g., Corolla)"
        />

        {preInput("Year", "Enter the year of manufacture")}
        <input
          required
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year (e.g., 2020)"
        />

        {preInput("License Plate", "Enter the car's license plate")}
        <input
          required
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="License Plate (e.g., ABC123)"
        />

        {preInput("Photos", "Upload photos of the car")}
        <PhotosUploader
          loading={loading}
          setLoading={setLoading}
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
          photoLink={photoLink}
          setPhotoLink={setPhotoLink}
        />

        {preInput("Description", "Describe the car's condition and features")}
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        ></textarea>

        {preInput("Features", "Select or enter the car's features")}
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {/* Features component similar to Perks */}
          <Perks features={features} setFeatures={setFeatures} />
        </div>

        {preInput("Extra Info", "Any additional details about the car")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          rows="4"
        ></textarea>

        {preInput("Mileage", "Enter the car's mileage")}
        <input
          required
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder="Mileage (e.g., 50000)"
        />

        {preInput("Price", "Enter the price for the car")}
        <input
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (e.g., 15000)"
        />

        <button type="submit" className="prim mt-2">
          Save
        </button>
      </form>
    </>
  );
};

export default CarForm;
