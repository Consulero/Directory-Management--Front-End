import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="shadow-md rounded-lg p-6 max-w-sm">
      <h1 className="text-lg font-medium text-gray-700 mb-2">{title}</h1>
      <p className="text-4xl font-bold text-blue-500">{value}</p>
    </div>
  );
};

export default Card;
