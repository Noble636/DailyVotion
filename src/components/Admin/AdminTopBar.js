import React, { useState } from "react";
import "../../css/Admin/AdminTopBar.css";

function TopBar({ menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = menuItems ?? [
    { label: "Home", link: "/" },
    { label: "User Login", link: "/login" },
    { label: "About", link: "/about" }
  ];

  return (
    <header className="topbar-container">
      {/* logo link only wraps the image so the label is not clickable */}
      <a href="/" className="topbar-logo-float" aria-label="Home">
        <img
          src={process.env.PUBLIC_URL + "/JTVCF/home page/logo v3.png"}
          alt="DailyVotion Logo"
          className="topbar-logo-float-img"
        />
      </a>

      {/* non-clickable label placed outside the anchor */}
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
