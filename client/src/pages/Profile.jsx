import { useState } from "react";
import {
  CameraAltOutlined,
  PersonOutlineOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleUpdatePicture = async () => {
    if (!selectedFile) {
      alert("Please select a new profile picture.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    const data = new FormData();
    data.append("profilePicture", selectedFile);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile-picture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      const updatedUser = {
        ...user,
        profilePicture: result.profilePicture,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSelectedFile(null);

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile picture error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-heading">
          <span>YOUR PROFILE</span>
          <h1>Profile</h1>
          <p>Manage your SocialSphere account.</p>
        </div>

        <div className="profile-picture-section">
          <label
            htmlFor="profile-picture-update"
            className="profile-picture-large"
          >
            {profilePicture ? (
              <img
                src={
                  profilePicture.startsWith("blob:")
                    ? profilePicture
                    : `${API_URL}${profilePicture}`
                }
                alt="Profile"
              />
            ) : (
              <PersonOutlineOutlined />
            )}

            <div className="profile-camera">
              <CameraAltOutlined />
            </div>
          </label>

          <input
            id="profile-picture-update"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            hidden
          />

          <p>Click your picture to choose a new one</p>

          {selectedFile && (
            <button
              className="profile-save-button"
              onClick={handleUpdatePicture}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile Picture"}
            </button>
          )}
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <PersonOutlineOutlined />

            <div>
              <span>Name</span>
              <strong>{user?.name || "User"}</strong>
            </div>
          </div>

          <div className="profile-detail">
            <EmailOutlined />

            <div>
              <span>Email</span>
              <strong>{user?.email || "No email"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;