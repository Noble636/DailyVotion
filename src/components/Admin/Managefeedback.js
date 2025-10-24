import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin/Managefeedback.css";
import AdminTopBar from "./AdminTopBar";

// Feedback will be loaded from backend

function Managefeedback() {
	const [feedbackList, setFeedbackList] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost:5000/api/admin/feedback')
			.then(res => res.json())
			.then(data => {
				setFeedbackList(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	return (
		<div
			className="managefeedback-container"
			style={{
				backgroundImage: "url('/JTVCF/for%20background%20picture/AdminDashboard.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				minHeight: "100vh",
			}}
		>
			<AdminTopBar
				menuItems={[
					{ label: "Dashboard", link: "/admindashboard" },
					{ label: "Logout", link: "/" },
					{ label: "About", link: "/about" },
				]}
			/>
			<div className="managefeedback-main">
				<h1 className="managefeedback-title">User Feedback & Reports</h1>
				<div className="managefeedback-list">
					{loading ? (
						<div style={{ color: '#888', padding: '1rem' }}>Loading feedback...</div>
					) : feedbackList.length === 0 ? (
						<div style={{ color: '#888', padding: '1rem' }}>No feedback submitted yet.</div>
					) : (
						feedbackList.map((fb, idx) => (
							<div className="managefeedback-item" key={idx}>
								<div className="managefeedback-text">{fb.text}</div>
								<div className="managefeedback-date">{fb.date}</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default Managefeedback;
