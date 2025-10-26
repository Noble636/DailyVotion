import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin/Manageprayer.css";
import AdminTopBar from "./AdminTopBar";

function PrayerHistoryPopup({ onClose, history }) {
    return (
        <div className="manageprayer-popup-overlay">
            <div className="manageprayer-popup-box">
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
                <h2 style={{ color: "#008b8b", marginBottom: "1rem" }}>Prayer Request History</h2>
                <ul style={{ maxHeight: "60vh", overflowY: "auto", padding: 0, margin: 0 }}>
                    {history.map((item) => (
                        <li
                            key={item.id}
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
                            <div style={{ fontWeight: 600, color: "#006d6d" }}>
                                <span>{item.user}</span>
                            </div>
                            <div style={{ color: "#07484a", fontSize: "0.96rem" }}>
                                <strong>Request:</strong> {item.request}
                            </div>
                            <div style={{ color: "#008b8b", fontSize: "0.96rem" }}>
                                <strong>Response:</strong> {item.response}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


function ManagePrayer() {
    const [prayerRequests, setPrayerRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [status, setStatus] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://dailyvotionbackend-91wt.onrender.com/api/admin/prayer')
            .then(res => res.json())
            .then(data => setPrayerRequests(data));
    }, []);

    const handleSelectRequest = (id) => {
        setSelectedRequest(id);
        setResponseText("");
        setStatus("");
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        if (selectedRequest && responseText.trim()) {
            try {
                const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/admin/prayer/${selectedRequest}/respond`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ response: responseText })
                });
                const data = await res.json();
                if (res.ok) {
                    setPrayerRequests(prayerRequests.map(p => p.id === selectedRequest ? data.prayer : p));
                    setStatus('Response sent!');
                    setResponseText("");
                } else {
                    setStatus(data.error || 'Failed to send response.');
                }
            } catch (err) {
                setStatus('Server error. Please try again later.');
            }
        } else {
            setStatus("Please select a request and enter a response.");
        }
    };

    return (
        <div
            className="manageprayer-container"
            style={{
                backgroundImage: "url('/JTVCF/for%20background%20picture/AdminDashboard.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh"
            }}
        >
            <AdminTopBar
                menuItems={[
                    { label: "Dashboard", link: "/admindashboard" },
                    { label: "Logout", link: "/" },
                    { label: "About", link: "/about" },
                ]}
            />
            <h1 className="manageprayer-title">Manage Prayer Requests</h1>
            <div className="manageprayer-main">
                <div className="manageprayer-requests">
                    <h2>Prayer Requests</h2>
                    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                        {prayerRequests.length === 0 ? (
                            <li style={{ color: '#888', padding: '1rem', textAlign: 'center' }}>No Prayer Requests Yet</li>
                        ) : (
                            prayerRequests.filter(req => req.status !== 'responded').map((req) => (
                                <li
                                    key={req.id}
                                    className={
                                        "manageprayer-request-item" +
                                        (selectedRequest === req.id ? " selected" : "")
                                    }
                                    onClick={() => handleSelectRequest(req.id)}
                                >
                                    <strong>{(req.userName && req.userName.trim() !== "") ? req.userName : `User ID: ${req.userId}`}</strong><br />
                                    <span>{req.text}</span>
                                    {req.status === 'responded' && (
                                        <span style={{ color: '#008b8b', marginLeft: 8 }}>[Responded]</span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="manageprayer-response">
                    <h2>Respond to Request</h2>
                    <form className="manageprayer-response-form" onSubmit={handleRespond}>
                        <textarea
                            className="manageprayer-response-textarea"
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            placeholder={selectedRequest ? "Type your prayer response here..." : "Select a request first"}
                            disabled={!selectedRequest}
                        />
                        <div className="manageprayer-btn-row">
                            <button type="submit" className="manageprayer-btn" disabled={!selectedRequest}>Send Response</button>
                            <button
                                type="button"
                                className="manageprayer-btn"
                                onClick={() => setShowHistory(true)}
                            >
                                View History
                            </button>
                        </div>
                    </form>
                    {status && <div className="manageprayer-status">{status}</div>}
                </div>
            </div>
            {showHistory && (
                <PrayerHistoryPopup
                    history={prayerRequests.filter(p => p.status === 'responded').map(p => ({
                        id: p.id,
                        user: (p.userName && p.userName.trim() !== "") ? p.userName : `User ID: ${p.userId}`,
                        request: p.text,
                        response: p.response
                    }))}
                    onClose={() => setShowHistory(false)}
                />
            )}
        </div>
    );
}

export default ManagePrayer;