import React, { useEffect, useState } from "react";
import axios from "../services/axiosConfig"; // your custom axios instance
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/user/profile", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setUser(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) return <h3>Loading Profile...</h3>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>👤 Profile</h1>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.address || "Not set"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
