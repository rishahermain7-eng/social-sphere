import { useState } from "react";
import {
  Search,
  NotificationsNone,
  WbSunnyOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function Navbar() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const profilePicture = user?.profilePicture
    ? `${API_URL}${user.profilePicture}`
    : null;

  return (
    <header className="navbar">
      <div className="search-box">
        <Search />

        <input
          type="text"
          placeholder="Search for people, posts, or topics..."
        />
      </div>

      <div className="navbar-actions">
        <button className="icon-button">
          <WbSunnyOutlined />
        </button>

        <button className="icon-button notification-button">
          <NotificationsNone />
          <span>1</span>
        </button>

        <div className="profile-mini">
          <div className="avatar">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={user?.name || "Profile"}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <strong>{user?.name || "User"}</strong>

          <KeyboardArrowDown />
        </div>
      </div>
    </header>
  );
}

export default Navbar;