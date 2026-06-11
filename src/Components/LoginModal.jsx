import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLoginUser, loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Modal.css"

const LoginModal = ({ closeModal, openSignupModal }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      toast.success(res.data.msg);
      localStorage.setItem("token", res.data.token);
      closeModal();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login Failed");
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      const res = await googleLoginUser(credential);
      toast.success(res.data.msg);
      localStorage.setItem("token", res.data.token);
      closeModal();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Google Login Failed");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <span className="auth-close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Login To MyShop</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="auth-divider">or</div>
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                width="320"
              />
            </div>
          </>
        )}

        <p className="auth-switch-text">
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              closeModal();
              openSignupModal();
            }}
          >
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
