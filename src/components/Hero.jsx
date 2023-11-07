import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CarouselProducts from "./CarouselProducts";

const Hero = () => {
  const [currentCover, setCurrentCover] = useState(0);
  const covers = [
    {
      title: "Towards sustainability",
      subtitle:
        "Transforming Industries with Our Sustainable Biotech Innovations",
      buttonLabel: "Explore our solutions",
      buttonLink: "/Solutions",
    },
    {
      title: "Ecofriendly",
      subtitle:
        "Sustainability Meets Technology: Discover Our Ecofriendly Biotech Products",
      buttonLabel: "Learn more",
      buttonLink: "/About",
    },
    {
      title: "Innovative",
      subtitle:
        "Innovative Biotech Products for a Cleaner and Healthier Environment",
      buttonLabel: "Contact us",
      buttonLink: "/Contact",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCover((currentCover + 1) % covers.length);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [covers.length, currentCover]);

  return (
    <div className="bg-teal-900 h-screen text-white">
      <div className="w-full h-screen mx-auto text-center flex flex-col md:flex-row justify-center align-center   px-4 md:px-10">
        <span className="max-w-[800px] md:w-[800px] flex flex-col justify-center mt-55 sm:mt-0">
          <p className="text-[#00df9a] font-bold p-2 sm:text-left text-transparent bg-clip-text  bg-gradient-to-tl from-purple-300 to-red-600">
            {covers[currentCover].title}
          </p>
          <h1 className="pl-2 md:text-4xl sm:text-4xl text-2xl font-bold  sm:text-left text-transparent bg-clip-text bg-gradient-to-tr from-yellow-600 to-green-500">
            {covers[currentCover].subtitle}
          </h1>
          <Link to={covers[currentCover].buttonLink}>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#00df9a] w-[150px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              {covers[currentCover].buttonLabel}
            </motion.button>
          </Link>
        </span>
        <span className="max-w-[600px] md:w-[600px] flex flex-col justify-center">
          <CarouselProducts />
        </span>
      </div>
    </div>
  );
};

export default Hero;
