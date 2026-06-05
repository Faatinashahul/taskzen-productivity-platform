import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Account() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ boards: 0, tasks: 0, notes: 0 });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [boardsRes, activityRes, notesRes] = await Promise.all([
        API.get("/boards"),
        API.get("/activity"),
        API.get("/notes"),
      ]);
      setStats({
        boards: boardsRes.data.length,
        tasks:  activityRes.data.filter((l) => l.message.includes("created")).length,
        notes:  notesRes.data.length,
      });
    } catch (err) { console.error(err); }
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?";

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div style={page}>

      {/* Profile Hero */}
      <div style={profileHero}>
        <div style={avatarRing}>
          <div style={avatar}>{avatarLetter}</div>
        </div>
        <h2 style={userName}>{user?.name}</h2>
        <p style={userEmail}>{user?.email}</p>
        {joinDate && (
          <p style={joinedText}>📅 Joined {joinDate}</p>
        )}
      </div>

      {/* Stats */}
      <div style={statsSection}>
        <p style={sectionLabel}>YOUR ACTIVITY</p>
        <div style={statsGrid}>
          <StatCard emoji="🗂️" value={stats.boards} label="Boards" color="#F28BB3" />
          <StatCard emoji="✅" value={stats.tasks}  label="Tasks"  color="#2ed573" />
          <StatCard emoji="💡" value={stats.notes}  label="Notes"  color="#ffa502" />
        </div>
      </div>

      {/* Sign Out */}
      <button onClick={logout} style={logoutBtn}>
         Sign Out
      </button>

    </div>
  );
}

function StatCard({ emoji, value, label, color }) {
  return (
    <div style={{ ...statCard, borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: "22px", marginBottom: "6px" }}>{emoji}</div>
      <div style={{ ...statNum, color }}>{value}</div>
      <div style={statLabel}>{label}</div>
    </div>
  );
}

export default Account;

const page = {
  padding: "0 0 100px",
  minHeight: "100vh",
  background: "#f4f6fb",
  fontFamily: "Arial, sans-serif",
};

const profileHero = {
  background: "linear-gradient(145deg, #a462e1 0%, #b489dc 50%, #ba99d9 100%)",
  padding: "44px 24px 36px",
  textAlign: "center",
  color: "white",
};

const avatarRing = {
  width: "84px",
  height: "84px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  border: "3px solid rgba(255,255,255,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
};

const avatar = {
  width: "68px",
  height: "68px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.25)",
  fontSize: "28px",
  fontWeight: "800",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const userName   = { margin: "0 0 4px", fontSize: "22px", fontWeight: "800" };
const userEmail  = { margin: "0 0 8px", opacity: 0.7, fontSize: "13px", fontWeight: "800" };
const joinedText = { margin: 0, opacity: 0.55, fontSize: "12px" };

const statsSection = {
  padding: "24px 20px 0",
};

const sectionLabel = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#aaa",
  letterSpacing: "1px",
  margin: "0 0 12px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  marginBottom: "20px",
};

const statCard = {
  background: "#fff",
  padding: "16px 10px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const statNum   = { fontSize: "26px", fontWeight: "800" };
const statLabel = { fontSize: "11px", color: "#888", marginTop: "4px" };

const quoteCard = {
  margin: "4px 20px 20px",
  background: "#fff",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  borderLeft: "4px solid #3742fa",
};

const quoteText = {
  margin: "0 0 8px",
  fontSize: "14px",
  color: "#333",
  fontStyle: "italic",
  lineHeight: "1.6",
};

const quoteAuthor = {
  margin: 0,
  fontSize: "12px",
  color: "#aaa",
  fontWeight: "600",
};

const logoutBtn = {
  display: "block",
  width: "calc(100% - 40px)",
  margin: "0 20px",
  padding: "14px",
  background: "#fff",
  color: "#e74c3c",
  border: "2px solid #fde0de",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "15px",
};
