import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CameraAltOutlined,
  PersonOutlineOutlined,
  EmailOutlined,
  LockOutlined,
  ArrowForward,
} from "@mui/icons-material";

import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();

  const [profilePreview, setProfilePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);

      const fileInput = document.getElementById("profile-picture");

      if (fileInput.files[0]) {
        data.append("profilePicture", fileInput.files[0]);
      }

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Account created successfully!");

      // Send the new user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration decoration-one"></div>
      <div className="auth-decoration decoration-two"></div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">S</div>

          <div>
            <h1>
              Social<span>Sphere</span>
            </h1>
            <p>Connect · Share · Discover</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <span>WELCOME TO SOCIALSPHERE</span>

            <h2>Create your account</h2>

            <p>
              Join the community, share your ideas and discover something new.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="profile-upload">
              <label
                htmlFor="profile-picture"
                className="profile-preview"
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                  />
                ) : (
                  <PersonOutlineOutlined />
                )}

                <div className="camera-button">
                  <CameraAltOutlined />
                </div>
              </label>

              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <span>Upload your profile picture</span>
              <small>JPG, PNG or WEBP</small>
            </div>

            <div className="input-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <PersonOutlineOutlined />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <EmailOutlined />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <LockOutlined />

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Create Account
              <ArrowForward />
            </button>
          </form>

          <div className="auth-divider">
            <span>Already part of the community?</span>
          </div>

          <Link
            to="/login"
            className="auth-switch"
          >
            Log in to your account
          </Link>
        </div>

        <p className="auth-footer">
          © 2026 SocialSphere · Connect with purpose.
        </p>
      </div>
    </div>
  );
}

export default Signup;