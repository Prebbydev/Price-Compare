import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const AuthModals = () => {
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const openSignUp = () => {
    setLoginOpen(false);
    setForgotPasswordOpen(false);
    setSignUpOpen(true);
  };

  const openLogin = () => {
    setSignUpOpen(false);
    setForgotPasswordOpen(false);
    setLoginOpen(true);
  };

  const openForgotPassword = () => {
    setSignUpOpen(false);
    setLoginOpen(false);
    setForgotPasswordOpen(true);
  };

  const closeAll = () => {
    setSignUpOpen(false);
    setLoginOpen(false);
    setForgotPasswordOpen(false);
  };

  return (
    <div className="hidden md:flex items-center space-x-6">
          <button onClick={openLogin} className="border px-4 py-1 rounded-md hover:bg-gray-100">Log In</button>
          <button onClick={openSignUp} className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800">Sign Up</button>
     

      {isSignUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <FiX className="absolute top-4 right-4 cursor-pointer text-gray-600" size={24} onClick={closeAll} />
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaUser className="text-gray-500 mr-2" />
              <input type="text" placeholder="Username" className="w-full outline-none" />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input type="email" placeholder="Email Address" className="w-full outline-none" />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaLock className="text-gray-500 mr-2" />
              <input type="password" placeholder="Password" className="w-full outline-none" />
            </div>
            <button className="w-full py-2 bg-blue-500 text-white rounded">Sign Up</button>
            <p className="mt-2 text-sm">Already have an account? <span className="text-blue-500 cursor-pointer" onClick={openLogin}>Log In</span></p>
            <p className="text-sm text-blue-500 cursor-pointer" onClick={openForgotPassword}>Forgot Password?</p>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <FiX className="absolute top-4 right-4 cursor-pointer text-gray-600" size={24} onClick={closeAll} />
            <h2 className="text-xl font-bold mb-4">Log In</h2>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaUser className="text-gray-500 mr-2" />
              <input type="text" placeholder="Username" className="w-full outline-none" />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaLock className="text-gray-500 mr-2" />
              <input type="password" placeholder="Password" className="w-full outline-none" />
            </div>
            <button className="w-full py-2 bg-green-500 text-white rounded">Log In</button>
            <p className="mt-2 text-sm">Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={openSignUp}>Sign Up</span></p>
            <p className="text-sm text-blue-500 cursor-pointer" onClick={openForgotPassword}>Forgot Password?</p>
          </div>
        </div>
      )}

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <FiX className="absolute top-4 right-4 cursor-pointer text-gray-600" size={24} onClick={closeAll} />
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <div className="flex items-center border rounded px-3 py-2 mb-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input type="email" placeholder="Enter your email" className="w-full outline-none" />
            </div>
            <button className="w-full py-2 bg-red-500 text-white rounded">Send Reset Link</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModals;
