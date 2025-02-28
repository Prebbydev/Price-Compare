import axios from "axios";

const API_BASE_URL = "https://price-compare-backend.onrender.com/api"; // Change to your backend URL

// Register User
export const registerUser = async (email, password, username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      username,
    });
    
    return response.data; // Return only data
  } catch (error) {
    console.error("Registration Error:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Registration failed";
  }
};

// Login User
export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  
      console.log("Login API Response:", response.data);
  
      if (response.data) {
        const user = response.data;
         return user;  
      } else {
          console.log("else")
        throw new Error("Invalid login response structure");
      }
    } catch (error) {
        console.log("catch")
      console.error("Login Error:", error);
      return { error: error.message || "Login failed" };
    }
  };
  
  

// Get User Profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw "No authentication token found";

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to fetch profile";
  }
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};
