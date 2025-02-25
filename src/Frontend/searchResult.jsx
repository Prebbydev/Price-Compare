import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const SearchResults = ({ location, products = [], initialSearch, onLocationChange, onSearch }) => {
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    stores: [],
    inStock: false,
  });
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");

  useEffect(() => {
    if (!products) return;
    const uniqueStores = [...new Set(products.map((product) => product.store))];
    setStores(uniqueStores);
  }, [products]);

  useEffect(() => {
    if (!products) return;
    let results = products.filter((product) =>
      filters.stores.length ? filters.stores.includes(product.store) : true
    );

    if (filters.minPrice) {
      results = results.filter((product) => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter((product) => product.price <= parseFloat(filters.maxPrice));
    }
    if (filters.inStock) {
      results = results.filter((product) => product.inStock);
    }
    setFilteredProducts(results);
  }, [filters, products]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleStore = (store) => {
    setFilters((prev) => {
      const updatedStores = prev.stores.includes(store)
        ? prev.stores.filter((s) => s !== store)
        : [...prev.stores, store];
      return { ...prev, stores: updatedStores };
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && onSearch) {
      onSearch(trimmedQuery);
    }
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
          <button type="submit" className="p-2 bg-blue-500 text-white">
            <FiSearch />
          </button>
        </form>

        {/* Location Display */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span className="text-gray-700 font-medium">{location}</span>
        </div>
      </div>

      // Sidebar Filters 
      <div className="col-span-3 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Location</h2>
        <div className="flex items-center gap-2 mb-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{location}</span>
        </div>
        <button
          onClick={onLocationChange}
          className="border px-3 py-1 rounded text-blue-500"
        >
          Change Location
        </button>

        // Price Filter 
        <h2 className="text-lg font-bold mt-6 mb-2">Price</h2>
        <label className="block text-sm font-medium text-gray-700">Min Price</label>
        <input
          type="number"
          name="minPrice"
          placeholder="Enter Min Price"
          className="border w-full p-2 rounded mb-2"
          onChange={handleFilterChange}
        />
        <label className="block text-sm font-medium text-gray-700">Max Price</label>
        <input
          type="number"
          name="maxPrice"
          placeholder="Enter Max Price"
          className="border w-full p-2 rounded mb-2"
          onChange={handleFilterChange}
        />

        // Store Filter 
        <h2 className="text-lg font-bold mt-6 mb-2">Stores</h2>
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.stores.includes(store)}
                onChange={() => toggleStore(store)}
              />
              <label>{store}</label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No stores available</p>
        )}

        // Availability Filter 

        <h2 className="text-lg font-bold mt-6 mb-2">Availability</h2>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleFilterChange}
          />
          <label>In Stock</label>
        </div>
      </div>

      // Products Grid 
      <div className="col-span-9">
        <h2 className="text-xl font-bold mb-4">
          Results for "{searchQuery || initialSearch}" in {location}
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {filteredProducts?.length > 0 ? (
            filteredProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-blue-500 font-semibold">
                  ₦{product.price.toLocaleString()} - {product.store}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
