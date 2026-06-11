import React, { useEffect, useMemo, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService";
import {
  FaBolt,
  FaBoxOpen,
  FaEdit,
  FaSearch,
  FaShippingFast,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaTags,
  FaTrash,
} from "react-icons/fa";
import "./Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      const productList = response.data.products || [];
      setProducts(productList);

      const initialQuantities = {};
      productList.forEach((product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(Boolean)
      .map((category) => category.toLowerCase());

    return ["all", ...new Set(uniqueCategories)];
  }, [products]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const query = searchTerm.toLowerCase().trim();
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;
      const matchesSearch =
        !query ||
        productName.includes(query) ||
        category.includes(query) ||
        description.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const featuredProduct = useMemo(() => {
    if (!products.length) return null;
    return [...products].sort((a, b) => (b.ratings || 0) - (a.ratings || 0))[0];
  }, [products]);

  const topDeals = useMemo(() => products.slice(0, 4), [products]);

  const handleQuantityChange = (productId, value) => {
    if (value >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    try {
      const res = await addToCart({ productId, quantity });
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add to cart");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await deleteProduct(productId);
      toast.success(res.data.msg);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete product");
    }
  };

  const formatCategory = (category) => {
    if (category === "all") return "All";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const renderProductCard = (product) => (
    <article key={product._id} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.productImage}
          alt={product.productName}
          className="product-image"
        />
        {product.isFreeDelivery && (
          <span className="delivery-badge">Free delivery</span>
        )}
      </div>

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.productName}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-meta">
          <strong>Rs. {product.price}</strong>
          <span>
            <FaStar /> {product.ratings || 0}
          </span>
        </div>

        {token && (
          <div className="quantity-control" aria-label="Quantity selector">
            <button
              type="button"
              onClick={() =>
                handleQuantityChange(
                  product._id,
                  Math.max(1, (quantities[product._id] || 1) - 1)
                )
              }
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantities[product._id] || 1}
              onChange={(e) =>
                handleQuantityChange(
                  product._id,
                  Math.max(1, Number(e.target.value))
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                handleQuantityChange(product._id, (quantities[product._id] || 1) + 1)
              }
            >
              +
            </button>
          </div>
        )}

        {token && (
          <div className="product-actions">
            <button
              type="button"
              onClick={() => handleAddToCart(product._id)}
              className="add-to-cart-btn"
              title="Add to cart"
            >
              <FaShoppingCart />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/edit-product/${product._id}`)}
              className="edit-btn"
              title="Edit product"
            >
              <FaEdit />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteProduct(product._id)}
              className="delete-btn"
              title="Delete product"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </article>
  );

  return (
    <main className="home-page">
      <section className="storefront-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <FaStore /> MyShop marketplace
          </span>
          <h1>Shop fresh finds, daily deals, and quick delivery picks.</h1>
          <p>
            Browse products by category, compare ratings, and add your favorites
            to cart in a few clicks.
          </p>
          <div className="hero-search">
            <FaSearch />
            <input
              type="search"
              placeholder="Search products, categories, brands"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hero-feature">
          {featuredProduct ? (
            <>
              <img src={featuredProduct.productImage} alt={featuredProduct.productName} />
              <div>
                <span>Featured today</span>
                <h2>{featuredProduct.productName}</h2>
                <p>Rs. {featuredProduct.price}</p>
              </div>
            </>
          ) : (
            <div className="hero-empty-feature">
              <FaBoxOpen />
              <h2>Add products to start selling</h2>
            </div>
          )}
        </div>
      </section>

      <section className="shopping-perks" aria-label="Shopping benefits">
        <div>
          <FaShippingFast />
          <span>Fast delivery</span>
        </div>
        <div>
          <FaTags />
          <span>Fresh offers</span>
        </div>
        <div>
          <FaBolt />
          <span>Easy checkout</span>
        </div>
      </section>

      {topDeals.length > 0 && (
        <section className="deal-strip" aria-label="Top deals">
          <div className="section-heading">
            <h2>Top Deals</h2>
            <span>{topDeals.length} picks</span>
          </div>
          <div className="deal-row">
            {topDeals.map((product) => (
              <button
                type="button"
                key={product._id}
                className="deal-tile"
                onClick={() => {
                  setSelectedCategory(product.category?.toLowerCase() || "all");
                  setSearchTerm(product.productName || "");
                }}
              >
                <img src={product.productImage} alt={product.productName} />
                <span>{product.productName}</span>
                <strong>Rs. {product.price}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="category-bar" aria-label="Product categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {formatCategory(category)}
          </button>
        ))}
      </section>

      <section className="product-section">
        <div className="section-heading">
          <h2>{selectedCategory === "all" ? "Recommended For You" : formatCategory(selectedCategory)}</h2>
          <span>{visibleProducts.length} items</span>
        </div>

        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="product-card skeleton-card" />
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="product-grid">{visibleProducts.map(renderProductCard)}</div>
        ) : (
          <div className="empty-home">
            <FaBoxOpen />
            <h2>No products found</h2>
            <p>Add your first product or try another search/category.</p>
            <button type="button" onClick={() => navigate("/add-product")}>
              Add Product
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;