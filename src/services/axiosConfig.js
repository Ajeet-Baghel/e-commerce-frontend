import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:4000/api"
    : "https://ajeet-node-ecommerce.netlify.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
