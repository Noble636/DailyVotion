import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin/AdminTopBar.css";

function TopBar({ menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    sessionStorage.removeItem("adminUser");
    navigate("/");
  };

  const items = menuItems
    ? menuItems.filter(item => item.label !== "User Login")
    : [
        { label: "Home", link: "/" },
        { label: "About", link: "/about" }
      ];

  return (
    <header className="topbar-container">
      <a href="/" className="topbar-logo-float" aria-label="Home">
        <img
          src={process.env.PUBLIC_URL + "/JTVCF/home page/logo v3.png"}
          alt="DailyVotion Logo"
          className="topbar-logo-float-img"
        />
      </a>

      <span className="topbar-admin-label" aria-hidden="true">
        Administration
      </span>

      <button
        className="topbar-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        <span className="topbar-menu-icon"></span>
      </button>

      {/* Remove top bar logout button, only show in dropdown */}

      {menuOpen && (
        <div className="topbar-dropdown-menu">
          <ul>
            {items.map((item, idx) => (
              <li key={idx}><a href={item.link}>{item.label}</a></li>
            ))}
            {/* Logout button below About, styled like other items */}
            <li>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontWeight: "normal",
                  fontSize: "inherit",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left"
                }}
                onClick={handleLogout}
              >Logout</button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default TopBar;
