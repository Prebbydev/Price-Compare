import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle,FaTimes,FaBars,FaBell, FaSignOutAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AuthModal from "./authModals";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black shadow-md z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold"> PriceCompare </div>

          <ul className="hidden md:flex space-x-8 font-medium">
            <li className="hover:text-gray-600 cursor-pointer">Women's Fashion</li>
            <li className="hover:text-gray-600 cursor-pointer">Men's Fashion</li>
            <li className="hover:text-gray-600 cursor-pointer">Health & Beauty</li>
            <li className="hover:text-gray-600 cursor-pointer">Baby & Kids</li>
          </ul>

          <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none">
          
          <FaUserCircle size={24} className="cursor-pointer hover:text-gray-600" />
            <span className="text-gray-700">▼</span>
            {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            <Link
              to="/price-alerts"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <FaBell className="mr-2 text-blue-500" />
              Price Alerts
            </Link>
            <button
              onClick={() => console.log("Logging out...")}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2 text-red-500" />
              Log Out
            </button>
            
            
          </div>
        )}
          </button>
          <AuthModal />
      
        
        
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button> 
    </div>
    </div>
    </nav>
  );
};

const HeroSection = () => {
  const images = [
    { src: "/Images/Img_1.jpg", textColor: "text-white" },
    { src: "/Images/Img_2.jpg", textColor: "text-black" },
    { src: "/Images/Img_3.jpg", textColor: "text-gray-900" },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Lagos");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={`Hero ${index}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="relative z-10 text-center p-60">
        <h1 className={`font-bold text-2xl md:text-4xl transition-all duration-500 ${images[currentIndex].textColor}`}>
          Find the best products, prices, and deals
        </h1>
       
        <div className="mt-8 flex justify-center w-full max-w-2xl mx-auto">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your location</option>
            <option value="Lagos">Lagos</option>
            <option value="Oyo">Oyo</option>
            <option value="Rivers">Rivers</option>
            <option value="Kano">Kano</option>
            <option value="Abuja">Abuja</option>
            <option value="Enugu">Enugu</option>
          </select>
           <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search for products, brands, or categories..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="px-6 py-2 bg-black text-white font-semibold rounded-r-md hover:bg-orange-600"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

const PopularProducts = () => {
  const products = [
    { name: 'Dell Inspiron 15 5584', img: '/images/product1.jpg' },
    { name: 'Apple iPhone 12', img: '/images/product2.jpg' },
    { name: 'Canon EOS 250D', img: '/images/product3.jpg' },
    { name: 'Sony PlayStation 5', img: '/images/product4.jpg' },
    { name: 'Samsung RT28M3043BS', img: '/images/product5.jpg' },
    { name: 'LG FJ46VY2W', img: '/images/product6.jpg' },
  ];

  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Popular Products</h2>
      <div className="flex overflow-x-scroll space-x-4">
        {products.map((product, index) => (
          <div key={index} className="min-w-[200px] flex-shrink-0">
            <img src={product.img} alt={product.name} className="w-full h-[150px] object-cover rounded-md" />
            <p className="mt-2 text-center font-medium">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Categories = () => {
  const categories = [
    { name: 'Electronics', img: '/images/category1.jpg' },
    { name: 'Fashion', img: '/images/category2.jpg' },
    { name: 'Home & Living', img: '/images/category3.jpg' },
    { name: 'Health & Beauty', img: '/images/category4.jpg' },
    { name: 'Baby & Kids', img: '/images/category5.jpg' },
    { name: 'Groceries', img: '/images/category6.jpg' },
    { name: 'Sports & Outdoors', img: '/images/category7.jpg' },
    { name: 'Automotive', img: '/images/category8.jpg' },
    { name: 'Books & Stationery', img: '/images/category9.jpg' },
    { name: 'Travel', img: '/images/category10.jpg' },
  ];

  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Explore by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="text-center">
            <img src={category.img} alt={category.name} className="w-full h-[100px] object-cover rounded-md" />
            <p className="mt-2 font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="mt-8 bg-gray-200 py-4 text-center text-sm">
      <p>&copy; 2025 PriceCompare. All rights reserved.</p>
    </footer>
  );
};

const HomePage = () => {
  return (    
  <div >
      <NavBar/>
      

      <HeroSection />
        <div className="mx-50">
          <PopularProducts />
          <Categories />
        </div>
     
      <Footer />
  </div>
  );
};

export default HomePage;
