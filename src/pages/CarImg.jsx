import React from "react";

const CarImg = ({ car, index = 0, className = null }) => {
  if (!className) {
    className = "object-cover";
  }
  return (
    <>
      {car?.photos.length > 0 && (
        <img className={className} src={car?.photos[index]} />
      )}
    </>
  );
};

export default CarImg;
