import React, { useState, useRef, useEffect } from "react";
import "../../css/User/UserJournal.css";
import TopBar from "../TopBar";

const soapSections = [
  { key: "scripture", label: "Scripture", description: "Write the Bible verse or passage you are reflecting on." },
  { key: "observation", label: "Observation", description: "Share what you notice or learn from the scripture." },
  { key: "application", label: "Application", description: "Describe how you can apply this scripture to your life." },
  { key: "prayer", label: "Prayer", description: "Write a prayer related to your reflection." },
];

function UserJournal() {
  const [inputErrors, setInputErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/journal`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistoryEntries(data);
      } else {
        setHistoryEntries([]);
      }
    } catch (err) {
      setHistoryEntries([]);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const [journal, setJournal] = useState({ date: "", scripture: "", observation: "", application: "", prayer: "" });
  const [visibleSections, setVisibleSections] = useState({ scripture: false, observation: false, application: false, prayer: false });
  const [showBible, setShowBible] = useState(false);
  const [showBibleInfo, setShowBibleInfo] = useState(false);
  const bibleIframeRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ x: 160, y: 120 });
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
  const popupRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.dragging) return;
      const nx = e.clientX - dragRef.current.offsetX;
      const ny = e.clientY - dragRef.current.offsetY;
      const rect = popupRef.current ? popupRef.current.getBoundingClientRect() : { width: 720, height: window.innerHeight * 0.8 };
      const maxX = Math.max(8, window.innerWidth - rect.width - 8);
      const maxY = Math.max(8, window.innerHeight - rect.height - 8);

      const clampedX = Math.max(8, Math.min(maxX, nx));
      const clampedY = Math.max(8, Math.min(maxY, ny));
      setPopupPos({ x: clampedX, y: clampedY });
    };
    const handleUp = () => { dragRef.current.dragging = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  useEffect(() => {
    if (showBible) {
      const timeoutId = setTimeout(() => {
        if (bibleIframeRef.current) {
          bibleIframeRef.current.focus();
        }
      }, 500); 
      return () => clearTimeout(timeoutId);
    }
  }, [showBible]);

  const startDrag = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.offsetX = e.clientX - popupPos.x;
    dragRef.current.offsetY = e.clientY - popupPos.y;
  };

  const handleChange = (e) => setJournal({ ...journal, [e.target.name]: e.target.value });
  const handleShowSection = (key) => setVisibleSections({ ...visibleSections, [key]: !visibleSections[key] });
  const handleClear = (key) => setJournal({ ...journal, [key]: "" });
  const [showSavePopup, setShowSavePopup] = useState(false);
  const handleSaveAll = async () => {
    setShowValidation(true);
    const errors = {};
    if (!journal.date) errors.date = 'Date is required.';
    if (!journal.scripture) errors.scripture = 'Scripture is required.';
    if (!journal.observation) errors.observation = 'Observation is required.';
    if (!journal.application) errors.application = 'Application is required.';
    if (!journal.prayer) errors.prayer = 'Prayer is required.';
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }
    try {
      const res = await fetch(`https://dailyvotionbackend-91wt.onrender.com/api/user/${userId}/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journal)
      });
      const data = await res.json();
      if (res.ok) {
        setShowSavePopup(true);
        setTimeout(() => setShowSavePopup(false), 1200);
      }
    } catch (err) {
    }
  };

  const pdfUrl = "/" + encodeURIComponent("NIVBible.pdf") + "#navpanes=0&toolbar=0&scrollbar=1";

  return (
    <div className="journalpage-container">
      <TopBar
        menuItems={[
          { label: "Profile", link: "/profile" },
          { label: "About", link: "/about" },
          { label: "Logout", link: "/" },
        ]}
      />
        {showSavePopup && (
          <div className="journal-save-popup">
            Journal entry saved!
          </div>
        )}

      <div
        className="journalpage-img-bg"
        style={{
          background: "url('/JTVCF/for background picture/5.jpg') center top / cover no-repeat",
          padding: "1rem 0 0 0",
          marginBottom: "0",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div className="journalpage-title">SOAP Journal</div>
        <p className="journalpage-guide-main">
          Do your devotion using the SOAP method: Scripture, Observation, Application, Prayer.
        </p>
        <div className="journalpage-date">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={journal.date}
            onChange={handleChange}
            required
          />
          {showValidation && inputErrors.date && (
            <div className="journal-input-error">{inputErrors.date}</div>
          )}
          <button
            className="journal-history-btn"
            type="button"
            onClick={() => setShowHistory(true)}
            style={{ marginLeft: '1rem', background: '#008b8b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: '500', cursor: 'pointer' }}
          >
            Journal History
          </button>
        </div>
      {showHistory && (
        <div className="journal-history-overlay">
          <div className="journal-history-popup">
            <button
              className="journal-history-close"
              type="button"
              onClick={() => setShowHistory(false)}
              aria-label="Close Journal History"
            >
              &times;
            </button>
            <h2 className="journal-history-title">Journal History</h2>
            {loadingHistory ? (
              <div>Loading...</div>
            ) : historyEntries.length === 0 ? (
              <div className="journal-history-empty">No journal entries found.</div>
            ) : (
              <div>
                {historyEntries.map((entry, idx) => (
                  <div key={idx} className="journal-history-entry">
                    <div className="journal-history-date">{entry.date ? entry.date.slice(0, 10) : ''}</div>
                    <div className="journal-history-field"><strong>Scripture:</strong> <span>{entry.scripture}</span></div>
                    <div className="journal-history-field"><strong>Observation:</strong> <span>{entry.observation}</span></div>
                    <div className="journal-history-field"><strong>Application:</strong> <span>{entry.application}</span></div>
                    <div className="journal-history-field"><strong>Prayer:</strong> <span>{entry.prayer}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      <div className="journalpage-pink-bg">
        <div className="journalpage-main">
          <div className="journalpage-soap-row">
            {soapSections.map((section) => (
              <div className="journalpage-soap-col" key={section.key}>
                <button
                  className={`journalpage-soap-btn${visibleSections[section.key] ? " active" : ""}`}
                  title={section.label}
                  onClick={() => handleShowSection(section.key)}
                >
                  {section.label}
                </button>
                <div
                  className="journalpage-guide-text"
                  style={{
                    visibility: visibleSections[section.key] ? "visible" : "hidden",
                    height: "40px",
                  }}
                >
                  {section.description}
                </div>
                <div
                  className="journalpage-section-box"
                  style={{
                    visibility: visibleSections[section.key] ? "visible" : "hidden",
                    height: "140px",
                  }}
                >
                  <label className="journalpage-section-label">{section.label}:</label>
                  <textarea
                    name={section.key}
                    value={journal[section.key]}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                  {showValidation && inputErrors[section.key] && (
                    <div className="journal-input-error">{inputErrors[section.key]}</div>
                  )}
                  <div className="journalpage-section-actions">
                    <button className="journalpage-clear-btn" onClick={() => handleClear(section.key)}>Clear</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="journalpage-bottom-actions">
            <button className="journalpage-save-btn" onClick={handleSaveAll}>Save</button>
            <button
              className="journalpage-cancel-btn"
              style={{ marginLeft: '1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: '500', cursor: 'pointer' }}
              onClick={() => window.location.href = '/profile'}
            >
              Cancel
            </button>
            <div className="journalpage-music-tooltip">
              <button
                className="journalpage-bible-btn"
                title="Open Bible"
                onClick={() => setShowBible(prev => !prev)}
              >
                {showBible ? "Close Bible" : "Bible"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBible && (
        <div
          className="journalpage-bible-popup"
          style={{ left: popupPos.x, top: popupPos.y }}
          role="dialog"
          aria-modal="false"
          ref={popupRef}
        >
          <div className="bible-header" onMouseDown={startDrag}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="bible-title">New International Version Bible</div>

              <div style={{ display: "flex", gap: 8 }}>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                className="bible-info-btn"
                onClick={() => setShowBibleInfo((s) => !s)}
                aria-expanded={showBibleInfo}
                aria-controls="bible-info-card"
              >
                Bible Info
              </button>
            </div>
          </div>

          {showBibleInfo && (
            <div id="bible-info-card" className="bible-info-card" role="dialog" aria-modal="false">
              <div className="bible-info-text">
                <p>Scripture quotations taken from The Holy Bible, New International Version®, NIV®.</p>
                <p>Copyright © 1973, 1978, 1984 by Biblica, Inc..</p>
                <p>Used by permission of Zondervan. All rights reserved worldwide.</p>
              </div>
            </div>
          )}
          
          <div className="bible-content">
             <div className="bible-pdf-wrap">
               <iframe
                 ref={bibleIframeRef} 
                 src={pdfUrl}
                 title="Bible PDF"
                 className="bible-pdf-iframe"
                 allowFullScreen
               />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default UserJournal;