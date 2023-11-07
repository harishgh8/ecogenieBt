import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import WhatsAppWidget from "./components/WhatsappWidget";
import AllProductsPage from "./pages/AllProductsPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import OurSolutionsPage from "./pages/OurSolutionsPage";
import Blog from "./pages/Blog";
import Career from "./pages/Career";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AllProductsPage" element={<AllProductsPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Solutions" element={<OurSolutionsPage />} />
          <Route path="/Career" element={<Career />} />
          <Route path="/Blog" element={<Blog />} />
        </Routes>
        <Footer />
        <WhatsAppWidget />
      </BrowserRouter>
    </>
  );
}

export default App;
