import React, { useEffect, useState } from "react";
import axios from "../services/axiosConfig";
import { updateUser } from "../services/userService";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/user/profile", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setUser(res.data.user);
      setFormData((currentData) => ({
        ...currentData,
        name: res.data.user.name || "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = { name: formData.name.trim() };
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      setIsSaving(true);
      const res = await updateUser(user._id, payload);
      const updatedUser = res.data.update;
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || "",
        password: "",
        confirmPassword: "",
      });
      setIsEditing(false);
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <h3>Loading Profile...</h3>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
          {!isEditing && (
            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Location:</strong> {user.address || "Not set"}</p>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </label>

            <label>
              New Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </label>

            <div className="profile-actions">
              <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
