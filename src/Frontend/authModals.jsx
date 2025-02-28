import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { registerUser, loginUser } from "../Utils/api";

const AuthModals = ({ onAuthSuccess }) => {
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
    setMessage("");
  };

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
    setMessage("");
  };

  const closeAll = () => {
    setSignUpOpen(false);
    setLoginOpen(false);
    setMessage("");
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    setLoading(true);
    try {
      await registerUser(email, password, username);
      setMessage("Sign up successful! Please log in.");
      setSignUpOpen(false);
      setLoginOpen(true);
    } catch (error) {
      setMessage(error || "Sign up failed. Try again.");
    }
    setLoading(false);
  };

  // Handle Log In
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response) {
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authToken", response.token);
        setUsername(userData.username);
        
        window.location.reload(); // 🔥 Force page reload to update state
      } else {
        throw new Error("User data is missing in response");
      }
  
      closeAll();
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="hidden md:flex items-center gap-8">
      <button onClick={openLogin} className="border px-4 py-1 rounded-md hover:bg-gray-100">
        Log In
      </button>
      <button onClick={openSignUp} className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800">
        Sign Up
      </button>

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed left-0 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <FiX className="absolute top-4 right-4 cursor-pointer text-gray-600" size={24} onClick={closeAll} />
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            {message && <p className="text-green-600 text-center">{message}</p>}
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaUser className="text-gray-500 mr-2" />
              <input type="text" placeholder="Username" className="w-full outline-none" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input type="email" placeholder="Email Address" className="w-full outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaLock className="text-gray-500 mr-2" />
              <input type="password" placeholder="Password" className="w-full outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="w-full py-2 bg-blue-500 text-white rounded" onClick={handleSignUp} disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <p className="mt-2 text-sm">
              Already have an account? <span className="text-blue-500 cursor-pointer" onClick={openLogin}>Log In</span>
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <FiX className="absolute top-4 right-4 cursor-pointer text-gray-600" size={24} onClick={closeAll} />
            <h2 className="text-xl font-bold mb-4">Log In</h2>
            {message && <p className="text-green-600 text-center">{message}</p>}
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input type="email" placeholder="Email Address" className="w-full outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaLock className="text-gray-500 mr-2" />
              <input type="password" placeholder="Password" className="w-full outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="w-full py-2 bg-green-500 text-white rounded" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModals;
