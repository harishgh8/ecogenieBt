import React from "react";
import ProductCard from "../components/ProductsCard";

import { PRODUCTS } from "../data/productsData";

const AllProductsPage = () => {
  return (
    <>
      <div className="bg-teal-800  text-white">
        <div className="w-full py-[5rem] px-4  text-black bg-teal-800 ">
          <div className="] mx-auto grid md:grid-cols-4 gap-10 bg-teal-800 mt-10">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProductsPage;
