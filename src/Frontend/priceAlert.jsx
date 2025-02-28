import { useState } from "react";

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Instant Pot Pressure Cooker", price: 50, image: "/images/pressure-cooker.jpg" },
    { id: 2, name: "Bose Noise Cancelling Headphones", price: 300, image: "/images/headphones.jpg" }
  ]);
  const [newAlert, setNewAlert] = useState({ name: "", price: "" });

  const handleInputChange = (e) => {
    setNewAlert({ ...newAlert, [e.target.name]: e.target.value });
  };

  const addAlert = () => {
    if (!newAlert.name || !newAlert.price) return;
    const newEntry = {
      id: alerts.length + 1,
      name: `Product ${alerts.length + 1}`, // Placeholder name
      price: Number(newAlert.price),
      image: "/images/default-product.jpg", // Default placeholder image
    };
    setAlerts([...alerts, newEntry]);
    setNewAlert({ name: "", price: "" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Price Drop Alerts</h1>
      <p className="text-gray-600 mb-4">Get notified when the price of a product drops below a certain amount.</p>

      {/* Form for Adding Alerts */}
      <div className="space-y-3 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={newAlert.url}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Desired Price (₦)"
          value={newAlert.price}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <button onClick={addAlert} className="w-full bg-blue-500 text-white p-2 rounded">
          Save Alert
        </button>
      </div>

      {/* Active Notifications */}
      <h2 className="text-xl font-bold mt-6 mb-2">Active Notifications</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <img src={alert.image} alt={alert.name} className="w-12 h-12 rounded" />
              <div>
                <p className="font-medium">{alert.name}</p>
                <p className="text-blue-500 font-semibold">₦{alert.price.toLocaleString()}</p>
              </div>
            </div>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceAlerts;
