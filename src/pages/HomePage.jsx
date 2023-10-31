import React from "react";
import About from "../components/About";
import Analytics from "../components/Analytics";
import Cards from "../components/Cards";
import Hero from "../components/Hero";
import ParticleContainer from "../components/ParticleContainer";

const HomePage = () => {
  return (
    <div>
      <div>
        <ParticleContainer />
        {/* Your other content goes here */}
        <Hero />
        <Analytics />
        <About />
        <Cards />
      </div>
    </div>
  );
};

export default HomePage;
