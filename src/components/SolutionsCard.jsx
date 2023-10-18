import React from "react";

const SolutionsCard = ({
  imageSrc,
  title,
  description,
  buttonLabel,
  buttonColor,
}) => {
  return (
    <div className="w-full shadow-xl flex flex-col items-center p-4 my-4 rounded-lg hover:scale-105 duration-300 bg-teal-700">
      <img className="h-130 w-90" src={imageSrc} alt="/" />

      <button
        className={`w-[200px] rounded-md font-medium  mx-auto px-6  bg-${buttonColor}`}
      >
        <h2 className="text-2xl font-bold text-center py-6 text-neutral-200">
          {title}
        </h2>
      </button>
    </div>
  );
};
export default SolutionsCard;
