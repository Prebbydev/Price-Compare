import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const SearchResults = ({ onLocationChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const location = searchParams.get("location") || "Nigeria"; // Default to Nigeria

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false); // Loader State

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedStores: [],
    inStock: false,
  });

  // Fetch products from backend
  useEffect(() => {
    if (!searchQuery) return;
    setLoading(true); // Show loader before fetching

    
    const apiUrl = `https://price-compare-backend.onrender.com/api/products?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          extractStores(data);
        } else {
          console.error("Unexpected API response format:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false)); // Hide loader after fetching
  }, [searchQuery, location]); // ✅ Add 'location' as a dependency


   // ✅ Extract unique stores from fetched products
   const extractStores = (data) => {
    const storeList = [...new Set(data.map((product) => product.store?.name))];
    setStores(storeList);
  };
  // Update filtered products based on filters
  useEffect(() => {
    if (!Array.isArray(products)) return;
  
    let results = products.filter((product) => {
      const price = parseFloat(product.price);
      const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
  
      if (price < minPrice || price > maxPrice) return false;
  
      if (filters.selectedStores?.length > 0 && !filters.selectedStores.includes(product.store?.name)) return false;
  
      if (filters.inStock && !product.availability) return false;
  
      return true;
    });
  
    setFilteredProducts(results);
  }, [filters, products]);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery.trim(), location });
    }
  };

  // ✅ Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Toggle store selection
  const toggleStore = (store) => {
    setFilters((prev) => {
      const updatedStores = prev.selectedStores.includes(store)
        ? prev.selectedStores.filter((s) => s !== store)
        : [...prev.selectedStores, store];
      return { ...prev, selectedStores: updatedStores };
    });
  };


  return (
    <div className="p-8 grid grid-cols-12 gap-6">
      {/* Navbar */}
      <div className="col-span-12 flex justify-between items-center mb-4">
        <div className="text-xl font-bold">PriceCompare</div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center border rounded-lg overflow-hidden w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 px-4 outline-none"
          />
          <button type="submit" className="p-2  text-black">
            <FiSearch />
          </button>
        </form>

        {/* Location Display */}
        <div className="flex items-center gap-2 mr-10">
          <FaMapMarkerAlt className="text-gray-500" />
          <span className="text-gray-700 font-medium">{location}</span>
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="col-span-3 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Location</h2>
        <div className="flex items-center gap-2 mb-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{location}</span>
        </div>
        <button onClick={onLocationChange} className="border px-3 py-1 rounded text-blue-500">
          Change Location
        </button>

        {/* Price Filter */}
        <h2 className="text-lg font-bold mt-6 mb-2">Price</h2>
        <label className="block text-sm font-medium text-gray-700">Min Price</label>
        <input type="number" name="minPrice" placeholder="Enter Min Price" className="border w-full p-2 rounded mb-2"  onChange={handleFilterChange} />
        <label className="block text-sm font-medium text-gray-700">Max Price</label>
        <input type="number" name="maxPrice" placeholder="Enter Max Price" className="border w-full p-2 rounded mb-2"  onChange={handleFilterChange} />

        {/* Store Filter */}
        <h2 className="text-lg font-bold mt-6 mb-2">Stores</h2>
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store} className="flex items-center gap-2">
              <input type="checkbox" 
              checked={filters.selectedStores.includes(store)} 
              onChange={() => toggleStore(store)} />
              <label>{store}</label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No stores available</p>
        )}

        {/* Availability Filter */}
        <h2 className="text-lg font-bold mt-6 mb-2">Availability</h2>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="inStock" checked={filters.inStock}  onChange={handleFilterChange} />
          <label>In Stock</label>
        </div>
      </div>

      {/* Products Grid */}
      <div className="col-span-9">
        <h2 className="text-xl font-bold mb-4">Results for "{searchQuery}" in {location}</h2>

        {/* Loader */}
        {loading ? (
          <div className="text-center text-lg font-semibold">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link to={`/product/${product.product_id}`} key={product.product_id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200">
                  <img src={product.image_url || "/placeholder.jpg"} alt={product.product_name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold">{product.product_name}</h3>
                  <p className="text-blue-500 font-semibold">₦{product.price.toLocaleString()}</p>
                  <p className="text-gray-700">{product.store?.name || "Unknown Store"}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
