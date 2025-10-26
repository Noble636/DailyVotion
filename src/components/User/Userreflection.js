import React, { useState, useEffect } from "react";
import TopBar from "../TopBar";
import "../../css/User/Userreflection.css";

function UserReflection() {
  const [reflectionText, setReflectionText] = useState("");
  const [reflections, setReflections] = useState([]);
  const [sentNotice, setSentNotice] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/reflections`)
      .then((res) => res.json())
      .then((data) => {
        setReflections(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const latestReflection = reflections.length > 0 ? reflections[0] : null;

  const myResponses = reflections
    .filter((r) => r.response)
    .map((r) => ({
      id: r.id,
      adminMessage: r.message || r.adminMessage || "",
      adminName: "Admin",
      sent_at: r.sent_at,
      response: r.response,
      responded_at: r.responded_at,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reflectionText.trim() || !latestReflection) return;
    const userId = localStorage.getItem("userId");
    fetch(
      `https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/reflection/${latestReflection.id}/response`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: reflectionText }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setReflectionText("");
        setSentNotice(true);
        setTimeout(() => setSentNotice(false), 2500);
        fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/reflections`)
          .then((res) => res.json())
          .then((data) => setReflections(data || []));
      })
      .catch(() => {
      });
  };

  return (
    <div className="userreflection-container">
      <TopBar
        title="Reflection & Journal"
        menuItems={[
          { label: "Profile", link: "/profile" },
          { label: "About", link: "/about" },
        ]}
      />

      <div className="userreflection-main">
        <aside className="userreflection-left">
          <h3 className="userreflection-left-title">Previous Reflections</h3>
          <div className="userreflection-left-list">
            {loading ? (
              <div>Loading...</div>
            ) : myResponses.length === 0 ? (
              <div style={{ color: "#888" }}>No previous reflections yet.</div>
            ) : (
              myResponses.map((resp) => (
                <div key={resp.id} className="userreflection-response-item">
                  <div className="userreflection-response-meta">
                    <span className="userreflection-response-date">
                      {resp.responded_at ? new Date(resp.responded_at).toLocaleString() : ""}
                    </span>
                  </div>
                  <div className="userreflection-response-admin">
                    <strong>Admin:</strong> {resp.adminMessage}
                  </div>
                  <div className="userreflection-response-text">
                    <strong>Your Reflection:</strong> {resp.response}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="userreflection-right">
          <div className="userreflection-verse-card">
            <div className="userreflection-verse-title">Reflection & Journal</div>
            <div className="userreflection-verse-text">
              {latestReflection ? (
                latestReflection.message
              ) : (
                <span style={{ color: "#888" }}>No reflection sent by admin yet.</span>
              )}
            </div>
            <div className="userreflection-verse-meta">
              <span>Sent by: Admin</span>
              <span>{latestReflection ? new Date(latestReflection.sent_at).toLocaleString() : ""}</span>
            </div>
          </div>

          <form className="userreflection-form" onSubmit={handleSubmit}>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Write your reflection..."
              className="userreflection-textarea"
              rows={6}
            />
            <div className="userreflection-form-actions">
              <button type="submit" className="userreflection-btn">
                Submit Reflection
              </button>
            </div>
            {sentNotice && <div className="userreflection-sent">Reflection submitted — thank you.</div>}
          </form>
        </section>
      </div>
    </div>
  );
}

export default UserReflection;