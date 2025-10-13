import React, { useState } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../services/productService"; // adjust path if needed
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    productImage: "",
    productName: "",
    category: "",
    description: "",
    price: "",
    ratings: 0,
    isFreeDelivery: false,
  });

  const [errors, setErrors] = useState({});

  const isValidURL = (url) => {
    const pattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    return pattern.test(url);
  };

  const validate = () => {
    const err = {};
    const validCategories = ["electronics", "clothing", "food", "books", "furniture"];

    if (!product.productImage.trim() || !isValidURL(product.productImage)) {
      err.productImage = "Valid image URL required";
    }
    if (!product.productName.trim()) {
      err.productName = "Product name is required";
    }
    if (!product.category || !validCategories.includes(product.category.toLowerCase())) {
      err.category = "Invalid category";
    }
    if (!product.description.trim()) {
      err.description = "Description is required";
    }
    if (product.price === "" || Number(product.price) < 0) {
      err.price = "Price must be ≥ 0";
    }
    if (product.ratings < 0 || product.ratings > 5) {
      err.ratings = "Ratings must be between 0 and 5";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setProduct((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await addProduct({
        ...product,
        category: product.category.toLowerCase(),
        price: Number(product.price),
        ratings: Number(product.ratings),
      });

      toast.success(res.data.msg || "Product added successfully");
      setProduct({
        productImage: "",
        productName: "",
        category: "",
        description: "",
        price: "",
        ratings: 0,
        isFreeDelivery: false,
      });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Image */}
        <div className="form-group">
          <label>Product Image URL</label>
          <input
            type="text"
            name="productImage"
            value={product.productImage}
            onChange={handleChange}
            className="input-field"
          />
          {errors.productImage && <span className="error">{errors.productImage}</span>}
        </div>

        {/* Product Name */}
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            className="input-field"
          />
          {errors.productName && <span className="error">{errors.productName}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="books">Books</option>
            <option value="furniture">Furniture</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="input-field"
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="input-field"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        {/* Ratings */}
        <div className="form-group">
          <label>Rating (0 to 5)</label>
          <input
            type="range"
            name="ratings"
            min="0"
            max="5"
            step="0.1"
            value={product.ratings}
            onChange={handleChange}
            className="range-input"
          />
          <span>{product.ratings}</span>
          {errors.ratings && <span className="error">{errors.ratings}</span>}
        </div>

        {/* Free Delivery */}
        <div className="form-group">
          <label>Free Delivery:</label>
          <div className="radio-group">
            <input
              type="radio"
              id="freeYes"
              name="isFreeDelivery"
              value="true"
              checked={product.isFreeDelivery === true}
              onChange={handleChange}
            />
            <label htmlFor="freeYes">Yes</label>
            <input
              type="radio"
              id="freeNo"
              name="isFreeDelivery"
              value="false"
              checked={product.isFreeDelivery === false}
              onChange={handleChange}
            />
            <label htmlFor="freeNo">No</label>
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
