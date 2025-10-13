import axios from "./axiosConfig";


export const placeOrder = async (data) => {
  return await axios.post("/placeOrder", data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
export const getOrder = async () => {
  return await axios.get("/getMyOrder", {
    headers: { Authorization: localStorage.getItem("token") },
  });
};
export const cancelOrder = async (orderId) => {
  return await axios.delete(`/cancelOrder/${orderId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

