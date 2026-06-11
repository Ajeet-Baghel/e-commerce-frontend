import axios from "./axiosConfig";

// Login API Call
export const loginUser = async (userData) => {
  return await axios.post("/login", userData);
};

export const googleLoginUser = async (credential) => {
  return await axios.post("/auth/google", { credential });
};

export const updateUser = async (userId, userData) => {
  return await axios.put(`/updateUser/${userId}`, userData, {
    headers: { Authorization: localStorage.getItem("token") },
  });
};

// Signup API Call
export const signupUser = async (userData) => {
  return await axios.post("/addUser", userData);
};
