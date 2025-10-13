import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import { toast } from "react-toastify";
import "./EditProduct.css";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    ratings: "",
    productImage: "",
    isFreeDelivery: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(productId);
      setProduct(res.data.product);
    } catch (error) {
      
      toast.error(error.response?.data?.msg ||"Failed to load product details");
    }
  };

  const validate = () => {
    const newErrors = {};
    const { productName, category, description, price, ratings, productImage } =
      product;

    if (!productName.trim()) newErrors.productName = "Product name is required";

    const validCategories = [
      "electronics",
      "clothing",
      "food",
      "books",
      "furniture",
    ];
    if (!category.trim()) {
      newErrors.category = "Category is required";
    } else if (!validCategories.includes(category.trim().toLowerCase())) {
      newErrors.category = "Invalid category";
    }

    if (!description.trim()) newErrors.description = "Description is required";

    if (!productImage.trim() || !isValidURL(productImage))
      newErrors.productImage = "Valid image URL is required";

    if (price === "" || price < 1) newErrors.price = "Price must be ≥ 1";

    if (ratings === "" || ratings < 0 || ratings > 5)
      newErrors.ratings = "Ratings must be between 0 and 5";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidURL = (url) => {
    // const pattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm;
    const pattern= /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(\?.*)?$/gm;

    return pattern.test(url);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await updateProduct(productId, {
        ...product,
        category: product.category.trim().toLowerCase(),
      });
      toast.success(res.data.msg || "Product updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update product");
    }
  };

  return (
    <div className="edit-product-container">
      <h2 className="m">Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
         <label>Image URL:</label>
        <input
          type="text"
          name="productImage"
          value={product.productImage}
          onChange={handleChange}
        />
        {errors.productImage && <span className="error">{errors.productImage}</span>}
        
        <label>Product Name:</label>
        <input
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
        />
        {errors.productName && <span className="error">{errors.productName}</span>}

        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="electronics / clothing / food / books / furniture"
        />
        {errors.category && <span className="error">{errors.category}</span>}

        <label>Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <span className="error">{errors.description}</span>}

        <label>Price (₹):</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}

        <label>Ratings:</label>
        <input
          type="number"
          name="ratings"
          value={product.ratings}
          step="0.1"
          onChange={handleChange}
        />
        {errors.ratings && <span className="error">{errors.ratings}</span>}

       

        <label>
          <input
            type="checkbox"
            name="isFreeDelivery"
            checked={product.isFreeDelivery}
            onChange={handleChange}
          />
          Free Delivery
        </label>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
