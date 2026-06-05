import { useEffect, useState } from "react";
import API from "../services/api";

function Activity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await API.get("/activity");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearActivity = async () => {
    if (!window.confirm("Clear all activity logs?")) return;
    try {
      await API.delete("/activity/clear");
      setLogs([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (message) => {
    if (message.includes("created")) return "✅";
    if (message.includes("deleted")) return "🗑️";
    if (message.includes("moved")) return "↔️";
    if (message.includes("reorder")) return "🔀";
    return "📝";
  };

  return (
    <div style={pageStyle}>
      <div style={headerRow}>
        <div>
          <h1 style={{ margin: 0 }}> Activity</h1>
          <p style={{ color: "#888", marginTop: "4px" }}>Recent actions on your tasks</p>
        </div>
        {logs.length > 0 && (
          <button onClick={clearActivity} style={clearBtn}>
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#aaa" }}>Loading...</p>
      ) : logs.length === 0 ? (
        <div style={emptyState}>
          <p>🗒️ No activity yet. Start creating tasks!</p>
        </div>
      ) : (
        <div style={listStyle}>
          {logs.map((log) => (
            <div key={log.id} style={logCard}>
              <div style={iconStyle}>{getIcon(log.message)}</div>
              <div style={{ flex: 1 }}>
                <div style={logMessage}>{log.message}</div>
                {log.task_title && (
                  <div style={logSub}>Task: {log.task_title}</div>
                )}
              </div>
              <div style={logTime}>
                {log.created_at
                  ? new Date(log.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activity;

const pageStyle = {
  padding: "30px 20px 100px",
  width: "98%",            // ✅ FULL WIDTH
  minHeight: "100vh",
  background: "#ffffff",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "24px",
};

const clearBtn = {
  padding: "8px 14px",
  background: "#ff6b6b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};

const listStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const logCard = {
  background: "#fff",
  padding: "14px 16px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  borderLeft: "4px solid #F28BB3",
};

const iconStyle = {
  fontSize: "20px",
  minWidth: "28px",
};

const logMessage = {
  fontWeight: "500",
  fontSize: "14px",
  color: "#333",
};

const logSub = {
  fontSize: "11px",
  color: "#aaa",
  marginTop: "3px",
};

const logTime = {
  fontSize: "11px",
  color: "#bbb",
  whiteSpace: "nowrap",
};

const emptyState = {
  textAlign: "center",
  color: "#aaa",
  marginTop: "60px",
  fontSize: "16px",
};
