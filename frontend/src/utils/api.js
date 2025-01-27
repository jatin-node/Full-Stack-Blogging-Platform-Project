import axios from "axios";
const backendLink = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const apiGet = async (endpoint, options = {}) => {
  try {
    const response = await axios.get(`${backendLink}${endpoint}`, {
      withCredentials: true, 
      ...options, 
    });
    return response.data;
  } catch (error) {
    console.error("API GET request error:", error);
    throw error;
  }
};

export const apiPost = async (endpoint, data, options = {}) => {
  try {
    const response = await axios.post(`${backendLink}${endpoint}`, data, {
      withCredentials: true, 
      ...options, 
    });
    return response.data;
  } catch (error) {
    console.error("API UPLOAD request error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const apiUpload = async (endpoint, formData, options = {}) => {
  try {
    const response = await axios.post(`${backendLink}${endpoint}`, formData, {
      withCredentials: true, 
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options, 
    });
    return response.data;
  } catch (error) {
    console.error("API UPLOAD request error:", error.response ? error.response.data : error.message);
    throw error;
  }
};
