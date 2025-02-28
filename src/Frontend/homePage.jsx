import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle,FaTimes,FaBars,FaBell, FaSignOutAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AuthModal from "./authModals";
import { logoutUser } from "../Utils/api";
import { AspectRatio } from 'react-aspect-ratio';

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);

  //  Retrieve username from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUsername(userObj.username || "User"); // Ensure username exists
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUsername(null);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black shadow-md z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">PriceCompare</div>

        {/* Categories Section */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li className="hover:text-gray-600 cursor-pointer">Women's Fashion</li>
          <li className="hover:text-gray-600 cursor-pointer">Men's Fashion</li>
          <li className="hover:text-gray-600 cursor-pointer">Health & Beauty</li>
          <li className="hover:text-gray-600 cursor-pointer">Baby & Kids</li>
        </ul>

        <div className="hidden md:flex items-center space-x-6 mr-5">
          {username ? (
            <div className="relative">
              {/* ✅ Welcome Message and Profile Icon */}
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                <FaUserCircle size={24} className="cursor-pointer hover:text-gray-600" />
                <span className="text-gray-700">Welcome, {username}</span>
              </button>

              {/* ✅ Dropdown Menu for Profile, Price Alerts, and Logout */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <Link to="/price-alerts" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <FaBell className="mr-2 text-blue-500" />
                    Price Alerts
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                    <FaSignOutAlt className="mr-2 text-red-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <AuthModal onAuthSuccess={setUsername} />
          )}
        </div>
      </div>
    </nav>
  );
};




const HeroSection = () => {
  const images = [
    { src: "/Images/Img_1.jpg" },
    { src: "/Images/Img_2.jpg" },
    { src: "/Images/Img_3.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Define searchQuery
  const [location, setLocation] = useState("Nigeria");
  const navigate = useNavigate();

  // Auto-slide image effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle search navigation
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Navigating to:", `/search?query=${query.trim()}&location=${location}`);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    } else {
      console.log("No query entered!");
    }
  };

  // Allow pressing "Enter" to trigger search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Search Bar & Content */}
      <div className="relative z-10 text-center p-60">
        <h1 className="font-bold text-white text-2xl md:text-4xl transition-all duration-500">
          Find the best products, prices, and deals
        </h1>

        {/* Search Input Section */}
        <div className="mt-8 flex justify-center w-full max-w-2xl mx-auto relative">
          {/* Location Dropdown */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="lagos">Lagos</option>
            <option value="oyo">Oyo</option>
            <option value="rivers">Rivers</option>
            <option value="kano">Kano</option>
            <option value="abuja">Abuja</option>
            <option value="enugu">Enugu</option>
          </select>

          {/* Search Input */}
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pl-10 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search Button */}
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
    { name: 'Dell Latitude ', img: '/images/dell.jpg' },
    { name: 'Apple iPhone 12', img: '/images/iphone.jpg' },
    { name: 'Canon EOS', img: '/images/canon.jpg' },
    { name: 'Sony PlayStation 5', img: '/images/sony.jpg' },
    { name: 'Samsung Galaxy', img: '/images/samsung.jpg' },
    { name: 'Television', img: '/images/LG.jpg' },
  ];
  const navigate = useNavigate();

  const handleClick = (productName) => {
    navigate(`/search?query=${encodeURIComponent(productName)}`);
  };
  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Popular Products</h2>
      <div className="flex overflow-x-scroll hide-scroll-bar space-x-4">
        {products.map((product, index) => (
          <div key={index} className="min-w-[200px] flex-shrink-0" onClick={() => handleClick(product.name)}> 
            <img src={product.img} alt={product.name} className="w-full h-[150px] object-cover rounded-md" />
            <p className="mt-2 text-center font-medium">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {popularProducts.map((product, index) => (
          <div
            key={index}
            onClick={() => handleClick(product.name)}
            className="cursor-pointer text-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-[150px] object-cover rounded-md"
            />
            <p className="mt-2 font-medium">{product.name}</p>
          </div>
        ))}
      </div>*/


const categories = [
  { name: "mobile-phones", img: "/images/phone.jpg" },
  { name: "laptops", img: "/images/laptop.jpg" },
  { name: "cameras", img: "/images/cameras.jpg" },
  { name: "televisions", img: "/images/tv.jpg" },
  { name: "generators", img: "https://ng.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/46/406137/1.jpg?6805" },
  { name: "home-appliances", img: "/images/rg.jpg" },
  { name: "electronics", img: "/images/ac.jpg" },
  { name: "gaming", img: "/images/gaming.jpg" }
];

const Categories = () => {
  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Explore by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link to={`/category/${category.name}`} key={category.name} className="block">
            <div className="text-center bg-white h-[15rem] rounded-lg shadow-md overflow-hidden">
             <AspectRatio ratio={"3/4"}>

              <img src={category.img} alt={category.name} className="w-full h-[15rem]  object-cover" />
             </AspectRatio>
       
              
            </div>
          </Link>
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
