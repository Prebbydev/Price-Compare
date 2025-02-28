import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://price-compare-backend.onrender.com/api/products?category=${categoryName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); 
        console.log(data) // ✅ Debugging
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) return <p className="text-center">Loading products...</p>;
  if (products.length === 0) return <p className="text-center">No products found in this category.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 capitalize">{categoryName.replace("-", " ")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link to={`/product/${product.product_id}`} key={product.product_id} className="block">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
             
              <img src={product.image_url || "/placeholder.jpg"} alt={product.product_name} className="w-full h-40 object-cover rounded-lg mb-2" />
              <h2 className="font-bold">{product.product_name}</h2>
              <p className="text-blue-500 font-semibold">₦{product.price.toLocaleString()}</p>
              <p className="text-gray-700">{product.store?.name || "Unknown Store"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
