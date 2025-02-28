import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change to your backend URL

export const registerUser = async (email, password, location) => {
  return await axios.post(`${API_BASE_URL}/auth/register`, {
    email,
    password,
    location,
  });
};

export const loginUser = async (email, password) => {
  return await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
};

export const getProfile = async (token) => {
  return await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
