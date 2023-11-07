import React from "react";

const ProductCard = ({
  imageSrc,
  title,
  description,
  buttonLabel,
  buttonColor,
}) => {
  return (
    <div className="w-full shadow-xl flex flex-col items-center p-4 my-4 rounded-lg hover:scale-105 duration-300 bg-teal-700">
      <img className="h-80 w-90" src={imageSrc} alt="/" />
      <h2 className="text-2xl font-bold text-center text-white py-6 border-b ">
        {title}
      </h2>
      <div className="text-center font-medium text-sm">
        <p className="py-2  mx-8 text-neutral-200 ">{description}</p>
      </div>
      <button
        className={`w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 bg-${buttonColor} bg-gradient-to-tl from-yellow-300 to-green-600`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};
export default ProductCard;
