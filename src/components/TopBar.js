import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TopBar.css";

const TopBar = ({ menuItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Remove Logout from items, will add manually below About
  const items = (menuItems ?? [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" }
  ]).filter(item => item.label !== "Logout");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header className="topbar-container">
      <a href="/" className="topbar-logo-float">
        <img
          src={process.env.PUBLIC_URL + "/JTVCF/home page/logo v3.png"}
          alt="DailyVotion Logo"
          className="topbar-logo-float-img"
        />
      </a>
      <button
        className="topbar-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        <span className="topbar-menu-icon"></span>
      </button>
      {menuOpen && (
        <div className="topbar-dropdown-menu">
          <ul>
            {items.map((item, idx) => (
              <li key={idx}><a href={item.link}>{item.label}</a></li>
            ))}
            {/* Logout button below About */}
            <li>
              <button style={{background: "none", border: "none", color: "#d32f2f", fontWeight: 500, cursor: "pointer", marginTop: "0.5rem"}} onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default TopBar;
