// import React, { useEffect, useState } from "react";
// import { getOrder, cancelOrder, placeOrder } from "../services/orderService";
// import { toast } from "react-toastify";
// import "./Order.css";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Order.jsx (Frontend)
// const fetchOrders = async () => {
//   try {
//     const res = await getOrder();
//     const orderList = res.data.orders;
//     setOrders(orderList);
//   } catch (error) {
//     toast.error(error.response?.data?.msg || "Failed to fetch orders");
//   } finally {
//     setLoading(false);
//   }
// };



//   const handleCancel = async (orderId) => {
//     console.log("Cancel Order ID:", orderId);
//     try {
//       await cancelOrder(orderId);
//       toast.success("Order Cancelled");
//       fetchOrders(); // refresh orders
//     } catch (error) {
//       toast.error(error.response?.data?.msg || "Failed to cancel order");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);



//   if (loading) return <h3>Loading your orders...</h3>;

//   if (!orders.length) return <h3>🛍️ You haven't placed any orders yet.</h3>;

//   return (
//     <div className="order-container">
//       <h2>Your Orders</h2>
//       {orders.map((order) => (
//         <div className="order-card" key={order._id}>
//           <p><strong>Order ID:</strong> {order._id}</p>
//           <p><strong>Status:</strong> {order.orderStatus}</p>
//           <p><strong>Payment:</strong> {order.paymentStatus}</p>
//           <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
//           <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
//           <div className="order-items">
//             {order.items.map((item) => (
//               <div key={item.productId?._id || item._id}>
//                 <p>{item.productId?.productName || "Product"} - Qty: {item.quantity}</p>
//               </div>
//             ))}
//           </div>
//           {order.orderStatus !== "cancelled" && (
//             <button
//               className="cancel-btn"
//               onClick={() => handleCancel(order._id)}
//             >
//               Cancel Order
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
// import React, { useEffect, useState } from "react";
// import { getOrder, cancelOrder, placeOrder } from "../services/orderService";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import "./Order.css";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const navigate = useNavigate();

//   // Load cart from localStorage
//   useEffect(() => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(cart);

//     const total = cart.reduce(
//       (sum, item) => sum + item.quantity * item.productId.price,
//       0
//     );
//     setTotalPrice(total);
//   }, []);

//   // Fetch existing orders
//   const fetchOrders = async () => {
//     try {
//       const res = await getOrder();
//       setOrders(res.data.orders || []);
//     } catch (error) {
//       toast.error(error.response?.data?.msg || "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Place a new order
//   const handlePlaceOrder = async () => {
//     if (!cartItems || cartItems.length === 0) {
//       toast.warning("Your cart is empty!");
//       return;
//     }

//     const userId = localStorage.getItem("userId"); // assuming you store user id
//     const orderData = {
//       items: cartItems,
//       totalPrice,
//       userId,
//     };

//     try {
//       const response = await placeOrder(orderData);
//       if (response.status === 201 || response.status === 200) {
//         toast.success("Order placed successfully!");
//         localStorage.removeItem("cart"); // clear cart after order
//         setCartItems([]);
//         setTotalPrice(0);
//         fetchOrders(); // refresh orders
//         navigate("/order-success"); // optional redirect
//       } else {
//         toast.error("Failed to place order");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Error placing order");
//     }
//   };

//   // Cancel existing order
//   const handleCancel = async (orderId) => {
//     try {
//       await cancelOrder(orderId);
//       toast.success("Order cancelled");
//       fetchOrders();
//     } catch (error) {
//       toast.error(error.response?.data?.msg || "Failed to cancel order");
//     }
//   };

//   if (loading) return <h3>Loading your orders...</h3>;

//   return (
//     <div className="order-container">
//       <h2>Your Orders</h2>

//       {/* Place Order Button */}
//       {cartItems.length > 0 && (
//         <button className="place-order-btn" onClick={handlePlaceOrder}>
//           Place Order (₹{totalPrice})
//         </button>
//       )}

//       {!orders.length && <h3>🛍️ You haven't placed any orders yet.</h3>}

//       {orders.map((order) => (
//         <div className="order-card" key={order._id}>
//           <p><strong>Order ID:</strong> {order._id}</p>
//           <p><strong>Status:</strong> {order.orderStatus}</p>
//           <p><strong>Payment:</strong> {order.paymentStatus}</p>
//           <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
//           <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
//           <div className="order-items">
//             {order.items.map((item) => (
//               <div key={item.productId?._id || item._id}>
//                 <p>{item.productId?.productName || "Product"} - Qty: {item.quantity}</p>
//               </div>
//             ))}
//           </div>
//           {order.orderStatus !== "cancelled" && (
//             <button
//               className="cancel-btn"
//               onClick={() => handleCancel(order._id)}
//             >
//               Cancel Order
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Order;

import React, { useEffect, useState } from "react";
import { getOrder, cancelOrder, placeOrder } from "../services/orderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const total = cart.reduce(
      (sum, item) => sum + item.quantity * item.productId.price,
      0
    );
    setTotalPrice(total);
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await getOrder();
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Place a new order
  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    const userId = localStorage.getItem("userId"); // assuming you store user id
    const orderData = {
      items: cartItems,
      totalPrice,
      userId,
    };

    try {
      const response = await placeOrder(orderData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cart"); // clear cart after order
        setCartItems([]);
        setTotalPrice(0);

        // ✅ Always fetch the updated orders list from backend
        fetchOrders();

        // optional redirect
        navigate("/order-success");
      } else {
        toast.error("Failed to place order");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error placing order");
    }
  };

  // Cancel an order
  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders(); // refresh after cancel
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to cancel order");
    }
  };

  if (loading) return <h3>Loading your orders...</h3>;

  return (
    <div className="order-container">
      <h2>Your Orders</h2>

      {/* Place Order Button */}
      {cartItems.length > 0 && (
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order (₹{totalPrice})
        </button>
      )}

      {!orders.length && <h3>🛍 You haven't placed any orders yet.</h3>}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.productId?._id || item._id}>
                <p>{item.productId?.productName || "Product"} - Qty: {item.quantity}</p>
              </div>
            ))}
          </div>

          {order.orderStatus !== "cancelled" && (
            <button
              className="cancel-btn"
              onClick={() => handleCancel(order._id)}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Order;


