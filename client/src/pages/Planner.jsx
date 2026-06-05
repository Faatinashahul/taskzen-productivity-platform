import { useEffect, useState } from "react";
import API from "../services/api";

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/all");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStatus = (task) => {
  if (task.column_title === "Completed") return "none";

  if (!task.due_date) return "none";

  const d = new Date(task.due_date);
  d.setHours(0, 0, 0, 0);

  if (d < today) return "overdue";
  if (d.getTime() === today.getTime()) return "today";
  return "upcoming";
};

  const statusConfig = {
    overdue: { label: "Overdue", color: "#ff6b6b", bg: "#fff5f5" },
    today:   { label: "Due Today", color: "#ffa502", bg: "#fffbf0" },
    upcoming:{ label: "Upcoming", color: "#2ed573", bg: "#f0fff6" },
    none:    { label: "No Date", color: "#ccc", bg: "#fafafa" },
  };

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    return getStatus(t) === filter;
  });

  const counts = {
    overdue: tasks.filter((t) => getStatus(t) === "overdue").length,
    today:   tasks.filter((t) => getStatus(t) === "today").length,
    upcoming:tasks.filter((t) => getStatus(t) === "upcoming").length,
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0,color: "#ffffff",textAlign:"left" }}>Planner</h1>
        <p style={{ color: "#ffffff", marginTop: "4px" }}>All tasks with due dates across your boards</p>
      </div>

      {/* Summary Cards */}
      <div style={summaryRow}>
        {[
          { key: "overdue", emoji: "🔴", label: "Overdue" },
          { key: "today",   emoji: "🟡", label: "Due Today" },
          { key: "upcoming",emoji: "🟢", label: "Upcoming" },
        ].map(({ key, emoji, label }) => (
          <div
            key={key}
            onClick={() => setFilter(filter === key ? "all" : key)}
            style={{
              ...summaryCard,
              background: filter === key ? statusConfig[key].color : "#fff",
              color: filter === key ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "20px" }}>{emoji}</div>
            <div style={{ fontSize: "22px", fontWeight: "700" }}>{counts[key]}</div>
            <div style={{ fontSize: "12px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={tabsStyle}>
        {["all", "overdue", "today", "upcoming"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...tabBtn,
              background: filter === f ? "#F28BB3" : "#eee",
              color: filter === f ? "white" : "#333",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <p style={{ color: "#aaa" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={emptyState}>
          <p>No tasks found for this filter.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {filtered.map((task) => {
            const status = getStatus(task);
            const cfg = statusConfig[status];
            return (
              <div key={task.id} style={{ ...taskCard, background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
                <div>
                  <div style={taskTitle}>{task.title}</div>
                  {task.board_title && (
                    <div style={taskMeta}>
                      📋 {task.board_title}
                      {task.column_title ? ` › ${task.column_title}` : ""}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...statusBadge, background: cfg.color }}>{cfg.label}</div>
                  <div style={dateText}>
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "No date"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Planner;



const pageStyle = {
  padding: "30px 20px 100px",
  width: "98%",            // ✅ FULL WIDTH
  minHeight: "100vh",
  background: "#ffffff",
};
const headerStyle = {
  marginBottom: "28px",
  padding: "30px 20px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #a98ee8, #fbc2eb)", // 💜✨
  color: "#2d2d2d",
  textAlign: "left",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};
const summaryRow = {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
};

const summaryCard = {
  flex: 1,
  padding: "16px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  transition: "0.2s",
};

const tabsStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  flexWrap: "wrap",
};

const tabBtn = {
  padding: "6px 14px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "13px",
};

const listStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const taskCard = {
  padding: "14px 16px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const taskTitle = {
  fontWeight: "600",
  fontSize: "14px",
};

const taskMeta = {
  fontSize: "11px",
  color: "#888",
  marginTop: "3px",
};

const statusBadge = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "12px",
  color: "white",
  fontSize: "11px",
  fontWeight: "600",
  marginBottom: "4px",
};

const dateText = {
  fontSize: "11px",
  color: "#888",
};

const emptyState = {
  textAlign: "center",
  color:"#efefef",
  marginTop: "60px",
  fontSize: "16px",
};
