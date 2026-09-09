import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EmailOutlined,
  LockOutlined,
  ArrowForward,
} from "@mui/icons-material";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

        <div className="auth-card login-card">
          <div className="auth-heading">
            <span>WELCOME BACK</span>

            <h2>Log in to SocialSphere</h2>

            <p>
              Continue sharing, discovering and connecting with the
              community.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}

              {!loading && <ArrowForward />}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to SocialSphere?</span>
          </div>

          <Link to="/signup" className="auth-switch">
            Create your account
          </Link>
        </div>

        <p className="auth-footer">
          © 2026 SocialSphere · Connect with purpose.
        </p>
      </div>
    </div>
  );
}

export default Login;