import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaStar, FaStore, FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://price-compare-backend.onrender.com/api/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p className="text-center mt-10 text-lg font-semibold">Loading product details...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500 text-lg">Product not found.</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-8">
      <div className="text-xl font-bold">PriceCompare</div>
        <div className="flex items-center border rounded-lg overflow-hidden w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 px-4 outline-none"
          />
          <button className="p-2 ">
            <FiSearch />
          </button>
        </div>
      </div>

      {/* Product Image & Title */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div>
            <img
              src={product.image_url || "/placeholder.jpg"}
              alt={product.product_name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-lg text-gray-700">{product.category}</p>
            <div className="flex items-center space-x-2 text-yellow-500">
              {[...Array(Math.round(product.average_rating))].map((_, i) => (
                <FaStar key={i} />
              ))}
              <span className="text-gray-600">({product.number_of_reviews} reviews)</span>
            </div>
            <h2 className="text-2xl font-semibold text-blue-600">₦{product.price.toLocaleString()}</h2>
            <h3 className={`text-lg font-semibold ${product.availability ? "text-green-500" : "text-red-500"}`}>
              {product.availability ? "In Stock" : "Out of Stock"}
            </h3>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold inline-block"
            >
              Buy Now
            </a>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-10 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Brand:</strong> {product.brand || "Unknown"}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> {product.availability ? "Yes" : "No"}</p>
            <p><strong>Number of Reviews:</strong> {product.number_of_reviews}</p>
          </div>
        </div>
      </div>

      {/* Price Comparison from Other Stores */}
      <h2 className="text-2xl font-bold mt-10 mb-4">More Buying Options</h2>
      <div className="space-y-4">
        {product.otherStores?.length > 0 ? (
          product.otherStores.map((store) => (
            <div key={store.name} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaStore className="text-blue-500 text-2xl" />
                <span className="text-lg font-medium">{store.name}</span>
              </div>
              <span className="text-lg font-semibold text-green-600">₦{store.price.toLocaleString()}</span>
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaShoppingCart />
                <span>Buy Now</span>
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No other stores have this product listed.</p>
        )}
      </div>

      

      {/* Price Drop Notification */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Get Price Drop Alerts</h2>
      <form className="bg-gray-100 p-4 rounded-lg w-1/2">
        <label className="block text-lg font-medium mb-2">Email Address</label>
        <input type="email" className="w-full p-2 border rounded-lg" placeholder="Enter your email" />
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
          Notify Me
        </button>
      </form>
    </div>
  );
};

export default ProductDetails;
