import React, { useEffect, useMemo, useState } from "react";
import {
  getCart,
  removeItem,
  clearCart,
  updateCart,
} from "../services/cartService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/orderService";
import {
  FaArrowLeft,
  FaBagShopping,
  FaBoxOpen,
  FaCreditCard,
  FaLocationDot,
  FaMinus,
  FaPlus,
  FaShieldHalved,
  FaTrash,
  FaTruckFast,
} from "react-icons/fa6";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load cart");
    }
  };

  const handlePlaceOrder = async () => {
    const address = shippingAddress.trim();

    if (!address) {
      toast.warning("Shipping address is required");
      return;
    }

    try {
      await placeOrder({ shippingAddress: address });
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to place order");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success("Item Removed");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart Cleared");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to clear cart");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.warning("Quantity cannot be less than 1");
      return;
    }
    try {
      await updateCart({ productId, quantity: newQuantity });
      toast.success("Quantity Updated");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update quantity");
    }
  };

  const itemCount = useMemo(() => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }, [cart]);

  const deliveryFee = cart?.items?.length ? 0 : 0;
  const grandTotal = (cart?.totalPrice || 0) + deliveryFee;

  if (!cart) {
    return (
      <main className="cart-page">
        <div className="cart-loading">
          <FaBagShopping />
          <h2>Loading your cart</h2>
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty-state">
          <FaBoxOpen />
          <h1>Your cart is empty</h1>
          <p>Discover products you like and add them here for checkout.</p>
          <button type="button" onClick={() => navigate("/")}> 
            <FaArrowLeft /> Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <span className="cart-kicker">
          <FaBagShopping /> Checkout bag
        </span>
        <h1>My Cart</h1>
        <p>{itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout.</p>
      </section>

      <section className="cart-layout">
        <div className="cart-items-panel">
          <div className="cart-panel-title">
            <h2>Cart Items</h2>
            <button type="button" onClick={handleClearCart} className="clear-btn">
              <FaTrash /> Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cart.items.map((item) => {
              const product = item.productId;
              const lineTotal = product.price * item.quantity;

              return (
                <article key={product._id} className="cart-item">
                  <img src={product.productImage} alt={product.productName} />

                  <div className="cart-item-info">
                    <span>{product.category || "Product"}</span>
                    <h3>{product.productName}</h3>
                    <p>Rs. {product.price} each</p>

                    <div className="quantity-control" aria-label="Quantity selector">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                        title="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product._id, Number(e.target.value))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>Rs. {lineTotal}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemove(product._id)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="cart-summary-panel">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>Rs. {cart.totalPrice}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}</strong>
            </div>
            <div className="summary-row muted">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>Rs. {grandTotal}</strong>
            </div>

            <label htmlFor="shippingAddress" className="address-label">
              <FaLocationDot /> Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              className="shipping-address"
              placeholder="House no, street, city, state, pincode"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows="4"
            />

            <button type="button" onClick={handlePlaceOrder} className="place-button">
              <FaCreditCard /> Place Order
            </button>

            <div className="checkout-benefits">
              <span>
                <FaTruckFast /> Free delivery on this cart
              </span>
              <span>
                <FaShieldHalved /> Secure checkout
              </span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Cart;