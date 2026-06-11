import React, { useEffect, useState } from "react";
import { getOrder, cancelOrder } from "../services/orderService";
import { toast } from "react-toastify";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to cancel order");
    }
  };

  if (loading) return <h3>Loading your orders...</h3>;

  return (
    <div className="order-container">
      <h2>Your Orders</h2>

      {!orders.length && <h3>You haven't placed any orders yet.</h3>}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Total Price:</strong> Rs. {order.totalPrice}</p>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.productId?._id || item._id}>
                <p>
                  {item.productId?.productName || "Product"} - Qty:{" "}
                  {item.quantity}
                </p>
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

export default Order;
