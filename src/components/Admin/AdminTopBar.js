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

  const items = menuItems ?? [
    { label: "Home", link: "/" },
    { label: "Logout", link: "#logout" },
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

      {/* Logout button on top bar */}
      <button
        className="topbar-logout-btn"
        style={{ marginLeft: "1rem", background: "#d32f2f", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", fontWeight: 500, cursor: "pointer" }}
        onClick={handleLogout}
      >
        Logout
      </button>

      {menuOpen && (
        <div className="topbar-dropdown-menu">
          <ul>
            {items.map((item, idx) => (
              item.label === "Logout"
                ? <li key={idx}><button style={{background: "none", border: "none", color: "#d32f2f", fontWeight: 500, cursor: "pointer"}} onClick={handleLogout}>Logout</button></li>
                : <li key={idx}><a href={item.link}>{item.label}</a></li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default TopBar;
