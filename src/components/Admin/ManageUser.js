import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import "../../css/Admin/ManageUser.css";

function Popup({ message, onOk, onCancel, okText = "OK", cancelText = "Cancel" }) {
  return (
    <div className="manageuser-popup-overlay">
      <div className="manageuser-popup-box" style={{ minWidth: 280, maxWidth: 340 }}>
        <div style={{ marginBottom: "1rem", fontSize: "1.08rem", color: "#222" }}>{message}</div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button onClick={onOk} style={{ background: '#08a3ad', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>{okText}</button>
        </div>
      </div>
    </div>
  );
}

function ManageUser() {
  const handleSaveAdminCode = (adminId) => {
    alert('Admin code saved!');
    setCodeId(null);
    setAdminCodeInput("");
  };
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("");
  const [codeId, setCodeId] = useState(null);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [showFirstWarning, setShowFirstWarning] = useState(false);
  const [showSecondWarning, setShowSecondWarning] = useState(false);
  const navigate = useNavigate();
  const loggedInAdminId = Number(localStorage.getItem("adminId"));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('https://dailyvotionbackend-91wt.onrender.com/api/admin/users').then(res => res.json()),
      fetch('https://dailyvotionbackend-91wt.onrender.com/api/admin/admins').then(res => res.json())
    ]).then(([usersData, adminsData]) => {
      setUsers(usersData.map(u => ({
        ...u,
        name: u.fullName || u.name,
        role: "User"
      })));
      setAdmins(adminsData.map(a => ({
        ...a,
        name: a.fullName,
        email: a.email,
        role: "Admin"
      })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleDeleteConfirmed = async () => {
    if (!deleteId || !deleteType) return;
    let url = "";
    if (deleteType === "admin") {
      url = `https://dailyvotionbackend-91wt.onrender.com/api/admin/admin/${deleteId}`;
    } else if (deleteType === "user") {
      url = `https://dailyvotionbackend-91wt.onrender.com/api/admin/user/${deleteId}`;
    }
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        if (deleteType === "admin") {
          setAdmins(prev => prev.filter(a => a.id !== deleteId));
        } else {
          setUsers(prev => prev.filter(u => u.id !== deleteId));
        }
        setShowSecondWarning(false);
        setDeleteId(null);
        setDeleteType("");
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div
      className="manageuser-container-fresh"
      style={{
        backgroundImage: "url('/JTVCF/for%20background%20picture/AdminDashboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <AdminTopBar />
      <div className="manageuser-main-fresh">
        <h1 className="manageuser-title">Manage Users</h1>
        <div className="manageuser-sections">
          <div className="manageuser-admins-fresh">
            <h2>Admin Accounts</h2>
            <ul>
              {admins.map((admin) => (
                <li key={admin.id} className="manageuser-user-item-fresh">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span className="manageuser-user-label-details">
                      <span className="manageuser-user-name">{admin.name}</span>
                      <span className="manageuser-user-email">{admin.email}</span>
                    </span>
                  </div>
                  <div>Role: {admin.role}</div>
                  <div className="manageuser-actions-fresh" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.4rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      {codeId === admin.id ? (
                        <>
                          <button onClick={() => { setCodeId(null); setAdminCodeInput(""); }}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => { setCodeId(admin.id); setAdminCodeInput(""); }}>Choose Admin Code</button>
                      )}
                    </div>
                    {codeId === admin.id && (
                      <div style={{ width: "100%" }}>
                        <label style={{ fontSize: "0.97rem", fontWeight: "500", marginBottom: "0.2rem", display: "block" }}>
                          Enable User Login
                        </label>
                        <input
                          type="text"
                          value={adminCodeInput}
                          onChange={e => setAdminCodeInput(e.target.value)}
                          placeholder="Enter Admin Code"
                          style={{ marginRight: "0.3rem", marginBottom: "0.4rem" }}
                        />
                        <button onClick={() => handleSaveAdminCode(admin.id)}>Save</button>
                      </div>
                    )}
                    {admin.id !== loggedInAdminId && (
                      <button
                        className="manageuser-delete-btn"
                        style={{ background: "#d32f2f", marginTop: "0.4rem" }}
                        onClick={() => { setDeleteId(admin.id); setDeleteType("admin"); setShowFirstWarning(true); }}
                      >
                        Delete Admin Account
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="manageuser-users-fresh">
            <h2>User Accounts</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id} className="manageuser-user-item-fresh">
                  <div className="manageuser-user-label-details" style={{ cursor: "pointer" }}
                    onClick={() => { setUserDetails(user); setShowUserDetails(true); }}>
                    <span className="manageuser-user-name">{user.name}</span>
                    <span className="manageuser-user-email">{user.email}</span>
                  </div>
                  <div>Role: {user.role}</div>
                  <div className="manageuser-actions-fresh" style={{ flexDirection: "row", gap: "0.4rem" }}>
                    <button className="manageuser-delete-btn" style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }} onClick={() => { setDeleteId(user.id); setDeleteType("user"); setShowFirstWarning(true); }}>Delete Account</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showUserDetails && userDetails && (
        <Popup
          message={
            <div>
              <div><strong>Username:</strong> {userDetails.username || userDetails.name}</div>
              <div><strong>Email:</strong> {userDetails.email}</div>
              <div><strong>Contact No.:</strong> {userDetails.mobile || "N/A"}</div>
            </div>
          }
          onOk={() => setShowUserDetails(false)}
          onCancel={() => setShowUserDetails(false)}
          okText="Close"
          cancelText=""
        />
      )}
      {showFirstWarning && (
        <Popup
          message={
            deleteType === "admin"
              ? "Deleting this admin account will remove all associated data from the database. Are you sure you want to proceed?"
              : "Deleting this user account will remove all associated data from the database. Are you sure you want to proceed?"
          }
          onOk={() => { setShowFirstWarning(false); setShowSecondWarning(true); }}
          onCancel={() => { setShowFirstWarning(false); setDeleteId(null); setDeleteType(""); }}
          okText="OK"
          cancelText="Cancel"
        />
      )}
      {showSecondWarning && (
        <Popup
          message={<span className="manageuser-warning">Warning: This deletion is permanent and cannot be undone. Proceed?</span>}
          onOk={handleDeleteConfirmed}
          onCancel={() => { setShowSecondWarning(false); setDeleteId(null); setDeleteType(""); }}
          okText="Confirm"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

export default ManageUser;
