import { useNavigate } from "react-router-dom";

import {
  HomeOutlined,
  ExploreOutlined,
  PeopleOutlineOutlined,
  NotificationsNoneOutlined,
  MailOutlineOutlined,
  BookmarkBorderOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
  Add,
} from "@mui/icons-material";

function Sidebar({ onCreatePost }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Home",
      icon: <HomeOutlined />,
      active: true,
    },
    {
      label: "Explore",
      icon: <ExploreOutlined />,
    },
    {
      label: "Communities",
      icon: <PeopleOutlineOutlined />,
    },
    {
      label: "Notifications",
      icon: <NotificationsNoneOutlined />,
    },
    {
      label: "Messages",
      icon: <MailOutlineOutlined />,
    },
    {
      label: "Bookmarks",
      icon: <BookmarkBorderOutlined />,
    },
    {
      label: "Profile",
      icon: <PersonOutlineOutlined />,
    },
    {
      label: "Settings",
      icon: <SettingsOutlined />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">S</div>

        <div>
          <h2>
            Social<span>Sphere</span>
          </h2>

          <p>Connect · Share · Discover</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${
              item.active ? "active" : ""
            }`}
            onClick={() => {
              if (item.label === "Profile") {
                navigate("/profile");
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        className="create-button"
        onClick={onCreatePost}
      >
        <Add />
        Create Post
      </button>

      <div className="sidebar-footer">
        © 2026 SocialSphere
        <br />
        Made with purpose. ♡
      </div>
    </aside>
  );
}

export default Sidebar;