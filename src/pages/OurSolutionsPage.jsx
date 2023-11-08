import React from "react";
import SolutionsCard from "../components/SolutionsCard";
import { Solutions } from "../data/solutionsData";
import ScrollToTopButton from "../components/ScrollToTopButton";

const OurSolutionsPage = () => {
  return (
    <>
      <div className="bg-teal-900  text-neutral-200">
        <div
          className="w-full py-[5rem] px-4 bg-teal-800  text-black"
          style={{
            backgroundSize: "cover",
          }}
        >
          <div className="] mx-auto grid md:grid-cols-4 gap-10 mt-10">
            {Solutions.map((product) => (
              <SolutionsCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default OurSolutionsPage;
