import React from "react";
import About from "../components/About";
import Analytics from "../components/Analytics";
import Cards from "../components/Cards";
import Hero from "../components/Hero";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Analytics />
      <About />
      <Cards />
    </div>
  );
};

export default HomePage;
