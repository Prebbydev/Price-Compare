import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './Frontend/homePage';
import SearchResult from './Frontend/searchResult';
import ProductDetails from './Frontend/productDetails';
import PriceAlert from './Frontend/priceAlert'
//import data from "./data.json"; // Your scraped data

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResult /*products={data}*/ />} />
        <Route path="/product/:productId" element={<ProductDetails /*(products={data} */ />} />
        <Route path="/price-alerts" element={<PriceAlert />} />
      </Routes>
    </Router>
  );
 
};

export default App;


