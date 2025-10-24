import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/ManageContent.css";

function Popup({ children, onClose }) {
  return (
    <div className="managecontent-popup-overlay">
      <div className="managecontent-popup-box">
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 18,
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            color: "#d32f2f",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function ManageContent() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [contentText, setContentText] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [showReflections, setShowReflections] = useState(false);
  const [reflectionHistory, setReflectionHistory] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const navigate = useNavigate();

  // Load users from backend
  useEffect(() => {
    setLoadingUsers(true);
    fetch("https://dailyvotionbackend.onrender.com/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch(() => setLoadingUsers(false));
  }, []);

  // Load reflection history from new backend endpoint (all user responses)
  const fetchReflectionHistory = () => {
    setLoadingHistory(true);
    fetch("https://dailyvotionbackend.onrender.com/api/admin/reflections/responses")
      .then(res => res.json())
      .then(data => {
        setReflectionHistory(data);
        setLoadingHistory(false);
      })
      .catch(() => setLoadingHistory(false));
  };

  const handleToggleUser = (id) => {
    setSelectedUsers((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((uid) => uid !== id) : [...prev, id];
      setSelectAll(next.length === users.length);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectAll((prev) => {
      const next = !prev;
      setSelectedUsers(next ? users.map((u) => u.id) : []);
      return next;
    });
  };

  const handleDeliver = (e) => {
    e.preventDefault();
    if (selectedUsers.length && contentText) {
      // Always use the correct logged-in adminId from localStorage
      const adminId = Number(localStorage.getItem("adminId"));
      if (!adminId) {
        setDeliveryStatus("Admin ID missing. Please log in again.");
        return;
      }
      fetch("https://dailyvotionbackend.onrender.com/api/admin/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, message: contentText, userIds: selectedUsers })
      })
        .then(res => res.json())
        .then(data => {
          setDeliveryStatus(`Delivered to ${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""}`);
          setContentText("");
          setSelectedUsers([]);
          setSelectAll(false);
        })
        .catch(() => setDeliveryStatus("Failed to deliver. Please try again."));
    } else {
      setDeliveryStatus("Please select at least one user and fill out the content.");
    }
  };

  return (
    <div
      className="managecontent-fresh-container"
      style={{
        backgroundImage: "url('/JTVCF/for%20background%20picture/AdminDashboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AdminTopBar
        menuItems={[
          { label: "Dashboard", link: "/admindashboard" },
          { label: "Logout", link: "/" },
          { label: "About", link: "/about" },
        ]}
      />

      <div className="managecontent-fresh-main" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 className="managecontent-fresh-title">Manage Content</h1>
        <div className="managecontent-fresh-sections" style={{ justifyContent: "center" }}>
          {/* LEFT: Deliver Reflection Activity Content */}
          <div className="managecontent-fresh-delivery box" style={{ position: "relative" }}>
            <h2>Reflection Activity Content</h2>
            <div style={{ color: "#006d6d", marginBottom: "1rem", fontSize: "1.01rem" }}>
              Write a reflection activity and send it to selected users. You can also view users’ past reflections.
            </div>
            <form onSubmit={handleDeliver} className="managecontent-fresh-form">
              <div className="managecontent-fresh-recipients">
                Selected recipients: {selectedUsers.length}
              </div>
              <label className="managecontent-fresh-label">
                Content:
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Enter reflection content here..."
                  className="managecontent-fresh-textarea"
                />
              </label>
              <div className="managecontent-btn-row">
                <button type="submit" className="managecontent-fresh-btn">
                  Deliver
                </button>
                <button
                  className="managecontent-fresh-btn"
                  type="button"
                  style={{ background: "#d32f2f" }}
                  onClick={() => {
                    setContentText("");
                    setDeliveryStatus("");
                    setSelectedUsers([]);
                    setSelectAll(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="managecontent-btn-row" style={{ marginTop: "0.7rem" }}>
                <button
                  className="managecontent-fresh-btn"
                  type="button"
                  style={{ background: "#008b8b" }}
                  onClick={() => {
                    setShowReflections(true);
                    fetchReflectionHistory();
                  }}
                >
                  User Reflection History
                </button>
              </div>
            </form>
            {deliveryStatus && (
              <div className="managecontent-fresh-status">{deliveryStatus}</div>
            )}
          </div>

          {/* RIGHT: User Accounts */}
          <div className="managecontent-fresh-users box">
            <h2>User Accounts</h2>
            <div className="managecontent-fresh-selectall">
              <label>
                <input type="checkbox" checked={selectAll} onChange={handleToggleAll} /> Select All
              </label>
            </div>
            {loadingUsers ? (
              <div>Loading users...</div>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user.id} className="managecontent-fresh-user-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleToggleUser(user.id)}
                      />
                      <span className="managecontent-fresh-user-label-details">
                        <span className="managecontent-fresh-user-name">{user.fullName || user.name}</span>
                        <span className="managecontent-fresh-user-email">{user.email}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* POPUP: User Reflection History */}
      {showReflections && (
        <Popup onClose={() => setShowReflections(false)}>
          <h2 style={{ color: "#008b8b", marginBottom: "1rem" }}>User Reflection History</h2>
          <button className="managecontent-fresh-btn" style={{ marginBottom: '1rem' }} onClick={fetchReflectionHistory}>
            Refresh History
          </button>
          {loadingHistory ? (
            <div>Loading history...</div>
          ) : (
            <ul style={{ maxHeight: "60vh", overflowY: "auto", padding: 0, margin: 0 }}>
              {reflectionHistory.length === 0 ? (
                <li style={{ color: '#888', padding: '1rem' }}>No reflection responses yet.</li>
              ) : (
                reflectionHistory
                  .filter(ref => ref.response) // Only show answered reflections
                  .map((ref, idx) => (
                    <li
                      key={ref.reflectionId + '-' + (ref.userId || idx)}
                      style={{
                        marginBottom: "1rem",
                        padding: "0.9rem",
                        borderRadius: "8px",
                        background: "#e0f7fa",
                        boxShadow: "0 2px 8px rgba(0,139,139,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.45rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "#006d6d" }}>
                        <span>{ref.userName || "Unknown User"}</span>
                        <span style={{ color: "#666", fontSize: "0.85rem" }}>{ref.responded_at ? new Date(ref.responded_at).toLocaleString() : ""}</span>
                      </div>
                      <div style={{ color: "#07484a", fontSize: "0.96rem" }}><strong>Admin:</strong> {ref.message}</div>
                      <div style={{ color: "#07484a", fontSize: "0.96rem" }}><strong>Response:</strong> {ref.response}</div>
                    </li>
                  ))
              )}
            </ul>
          )}
        </Popup>
      )}
    </div>
  );
}

export default ManageContent;