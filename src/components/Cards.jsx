import React from "react";
import biofert1 from "../assets/biofert1.png";
import assortd from "../assets/assortd.png";
import banana_spl from "../assets/banana_spl.png";

const Cards = () => {
  return (
    <div className="w-full py-[10rem] px-4 bg-neutral-200 sm:px-10">
      <div className="] mx-auto grid md:grid-cols-3 gap-8">
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-30 mx-auto mt-[3rem] bg-neutral-200"
            src={biofert1}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">
            Microbial Consortia
          </h2>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">
              {" "}
              Microbial Consortia work together in a cooperative manner for a
              specific purpose, found in various environments such as soil,
              water and the human gut. Nourishing functions like breaking down
              organic matter, producing nutrients and controlling
              disease-causing organisms.
            </p>
          </div>
          <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Explore more
          </button>
        </div>
        <div className="w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-30 mx-auto mt-[3rem] bg-transparent "
            src={banana_spl}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">
            Micronutrients
          </h2>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">
              Micronutrients are vital for plant growth, including elements like
              iron, zinc, and manganese. They aid in enzyme activation,
              chlorophyll synthesis, and nutrient absorption. Deficiencies can
              lead to stunted growth and reduced yields, emphasizing the
              importance of balanced fertilization.
            </p>
          </div>
          <button className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Explore more
          </button>
        </div>
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-30 mx-auto mt-[3rem] bg-neutral-200"
            src={assortd}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">
            All our solutions
          </h2>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">
              {" "}
              Our solutions can range from fertilizers and soil amendments to
              pest control products and watering systems. Help to improve plant
              health, increase yields, and protect against diseases and pests.
              Sustainable and eco-friendly options, create environmentally
              responsible gardens and farms.
            </p>
          </div>
          <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Explore more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
