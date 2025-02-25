import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const ProductDetails = ({ products }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products) {
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
  }, [productId, products]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8">
      
      <div className="flex justify-between items-center mb-8">
        <img src="/logo.png" alt="Price Compare" className="h-8" />
        <div className="flex items-center border rounded-lg overflow-hidden w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 px-4 outline-none"
          />
          <button className="p-2 bg-gray-200">
            <FiSearch />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button>🔍</button>
          <button>❤️</button>
          <button>🛒</button>
        </div>
      </div>

     
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

     
      <div className="grid grid-cols-3 gap-4">
        {product.images.map((img, index) => (
          <img key={index} src={img} alt={product.name} className="rounded-lg" />
        ))}
      </div>

     
      <div className="grid grid-cols-2 gap-6 mt-8 border-t pt-6">
        <div>
          <h2 className="text-lg font-bold">Brand</h2>
          <p className="text-gray-600">{product.brand}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Operating System</h2>
          <p className="text-gray-600">{product.os}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Wireless Technology</h2>
          <p className="text-gray-600">{product.wireless}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Cellular Technology</h2>
          <p className="text-gray-600">{product.cellular}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Storage Capacity</h2>
          <p className="text-gray-600">{product.storage}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Color</h2>
          <p className="text-gray-600">{product.color}</p>
        </div>
      </div>

     
      <h2 className="text-2xl font-bold mt-10 mb-4">Price Comparison</h2>
      <div className="space-y-4">
        {product.prices.map((store) => (
          <div key={store.name} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <img src={store.logo} alt={store.name} className="h-8 w-8" />
              <span className="text-lg font-medium">{store.name}</span>
            </div>
            <span className="text-lg font-semibold">₦{store.price.toLocaleString()}</span>
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Buy Now
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Price Comparison</h2>
      <div className="space-y-4">
        {product.prices.map((store) => (
          <div key={store.name} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <img src={store.logo} alt={store.name} className="h-8 w-8" />
              <span className="text-lg font-medium">{store.name}</span>
            </div>
            <span className="text-lg font-semibold">₦{store.price.toLocaleString()}</span>
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Buy Now
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Price Drop Notification</h2>
      <form className="bg-gray-100 p-4 rounded-lg w-1/2">
        <label className="block text-lg font-medium mb-2">Email Address</label>
        <input type="email" className="w-full p-2 border rounded-lg" placeholder="Enter your email" />
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full">
          Notify Me
        </button>
      </form>
    </div>
  );
};

export default ProductDetails;
