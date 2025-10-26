import React, { useState } from "react";
import "../css/TopBar.css";

function TopBar({ menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = menuItems ?? [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Logout", link: "/" }
  ];

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
          </ul>
        </div>
      )}
    </header>
  );
}

export default TopBar;
