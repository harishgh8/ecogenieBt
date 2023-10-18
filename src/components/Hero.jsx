import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bgCover_1 from "../assets/bgCover_1.jpg";
import bg_Cover_02 from "../assets/bg_Cover_02.jpg";
import heroCover_0 from "../assets/heroCover_0.jpg";
import CarouselProducts from "./CarouselProducts";

const Hero = () => {
  const [currentCover, setCurrentCover] = useState(0);
  const covers = [
    {
      image: heroCover_0,
      title: "Towards sustainability",
      subtitle:
        "Transforming Industries with Our Sustainable Biotech Innovations",
      buttonLabel: "Explore our solutions",
      buttonLink: "/Solutions",
    },
    {
      image: bgCover_1,
      title: "Ecofriendly",
      subtitle:
        "Sustainability Meets Technology: Discover Our Ecofriendly Biotech Products",
      buttonLabel: "Learn more",
      buttonLink: "/About",
    },
    {
      image: bg_Cover_02,
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
    <div
      className="bg-teal-900 h-screen text-white"
      style={{
        backgroundImage: `url(${covers[currentCover].image})`,
        backgroundSize: "cover",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="w-full h-screen mx-auto text-center flex flex-col md:flex-row justify-center align-center   px-4 md:px-10">
        <span className="max-w-[800px] md:w-[800px] flex flex-col justify-center mt-55 sm:mt-0">
          <p className="text-[#00df9a] font-bold p-2 sm:text-left">
            {covers[currentCover].title}
          </p>
          <h1 className="md:text-4xl sm:text-4xl text-2xl font-bold  sm:text-left">
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
