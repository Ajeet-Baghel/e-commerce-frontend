import React, { useState } from "react";
import { toast } from "react-toastify";
import { addProduct, generateProductContent } from "../services/productService";
import {
  FaBoxOpen,
  FaImage,
  FaIndianRupeeSign,
  FaList,
  FaTruckFast,
  FaStar,
  FaTag,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import "./AddProduct.css";

const categories = ["electronics", "clothing", "food", "books", "furniture"];

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
  const [isGenerating, setIsGenerating] = useState(false);

  const isValidURL = (url) => {
    const pattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    return pattern.test(url);
  };

  const validate = () => {
    const err = {};

    if (!product.productImage.trim() || !isValidURL(product.productImage)) {
      err.productImage = "Valid image URL required";
    }
    if (!product.productName.trim()) {
      err.productName = "Product name is required";
    }
    if (!product.category || !categories.includes(product.category.toLowerCase())) {
      err.category = "Invalid category";
    }
    if (!product.description.trim()) {
      err.description = "Description is required";
    }
    if (product.price === "" || Number(product.price) < 0) {
      err.price = "Price must be >= 0";
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

  const handleGenerateContent = async () => {
    const err = {};

    if (!product.productName.trim()) {
      err.productName = "Product name is required for AI generation";
    }
    if (!product.category || !categories.includes(product.category.toLowerCase())) {
      err.category = "Select a valid category for AI generation";
    }

    if (Object.keys(err).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
      toast.error("Add product name and category first");
      return;
    }

    try {
      setIsGenerating(true);
      const res = await generateProductContent({
        productName: product.productName,
        category: product.category,
        price: product.price,
        isFreeDelivery: product.isFreeDelivery,
        description: product.description,
        productImage: product.productImage,
      });

      setProduct((prev) => ({
        ...prev,
        description: res.data.content.description,
      }));
      setErrors((prev) => ({ ...prev, description: undefined }));
      toast.success("AI description generated");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to generate AI content");
    } finally {
      setIsGenerating(false);
    }
  };

  const previewImageIsValid = product.productImage && isValidURL(product.productImage);

  return (
    <main className="add-product-page">
      <section className="add-product-header">
        <span className="seller-kicker">
          <FaBoxOpen /> Seller Studio
        </span>
        <h1>Add Product</h1>
        <p>Create a clean listing with image, price, category, rating, and delivery details.</p>
      </section>

      <section className="add-product-shell">
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-section-title">
            <h2>Product Details</h2>
            <span>All fields are required</span>
          </div>

          <div className="form-grid-two">
            <div className="form-group">
              <label htmlFor="productName">
                <FaTag /> Product Name
              </label>
              <input
                id="productName"
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                className="input-field"
                placeholder="Wireless headphones"
              />
              {errors.productName && <span className="error">{errors.productName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                <FaList /> Category
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productImage">
              <FaImage /> Product Image URL
            </label>
            <input
              id="productImage"
              type="text"
              name="productImage"
              value={product.productImage}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/product.jpg"
            />
            {errors.productImage && <span className="error">{errors.productImage}</span>}
          </div>

          <div className="form-group">
            <div className="description-label-row">
              <label htmlFor="description">Description</label>
              <button
                type="button"
                className="ai-generate-btn"
                onClick={handleGenerateContent}
                disabled={isGenerating}
                title="Generate product description with AI"
              >
                <FaWandMagicSparkles />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Highlight the most important features buyers should know."
              rows="5"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-grid-two">
            <div className="form-group">
              <label htmlFor="price">
                <FaIndianRupeeSign /> Price
              </label>
              <input
                id="price"
                type="number"
                name="price"
                min="0"
                value={product.price}
                onChange={handleChange}
                className="input-field"
                placeholder="999"
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ratings">
                <FaStar /> Rating
              </label>
              <div className="rating-control">
                <input
                  id="ratings"
                  type="range"
                  name="ratings"
                  min="0"
                  max="5"
                  step="0.1"
                  value={product.ratings}
                  onChange={handleChange}
                  className="range-input"
                />
                <strong>{Number(product.ratings).toFixed(1)}</strong>
              </div>
              {errors.ratings && <span className="error">{errors.ratings}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaTruckFast /> Delivery
            </label>
            <div className="delivery-options">
              <label className={product.isFreeDelivery ? "selected" : ""}>
                <input
                  type="radio"
                  name="isFreeDelivery"
                  value="true"
                  checked={product.isFreeDelivery === true}
                  onChange={handleChange}
                />
                Free Delivery
              </label>
              <label className={!product.isFreeDelivery ? "selected" : ""}>
                <input
                  type="radio"
                  name="isFreeDelivery"
                  value="false"
                  checked={product.isFreeDelivery === false}
                  onChange={handleChange}
                />
                Standard Delivery
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>

        <aside className="product-preview-panel" aria-label="Product preview">
          <div className="preview-card">
            <div className="preview-image">
              {previewImageIsValid ? (
                <img src={product.productImage} alt={product.productName || "Product preview"} />
              ) : (
                <div className="preview-placeholder">
                  <FaImage />
                  <span>Image preview</span>
                </div>
              )}
              {product.isFreeDelivery && <span className="preview-badge">Free delivery</span>}
            </div>
            <div className="preview-body">
              <span className="preview-category">{product.category || "Category"}</span>
              <h3>{product.productName || "Product name"}</h3>
              <p>{product.description || "Your product description will appear here."}</p>
              <div className="preview-meta">
                <strong>Rs. {product.price || "0"}</strong>
                <span>
                  <FaStar /> {Number(product.ratings).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default AddProduct;
