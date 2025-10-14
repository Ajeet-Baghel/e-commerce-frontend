import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:4000"
    : "https://ajeet-node-ecommerce.netlify.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
