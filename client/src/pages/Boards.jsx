import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const gradients = [
  "linear-gradient(135deg, #f6d365, #fda085)",
  "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "linear-gradient(135deg, #d4fc79, #96e6a1)",
  "linear-gradient(135deg, #84fab0, #8fd3f4)",
  "linear-gradient(135deg, #fccb90, #d57eeb)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
];

function Boards() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle]   = useState("");
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { fetchBoards(); }, []);

  const fetchBoards = async () => {
    try {
      const res = await API.get("/boards");
      setBoards(res.data);
    } catch (err) { console.error(err); }
  };

  const createBoard = async () => {
    if (!title.trim()) return;
    try {
      await API.post("/boards/create", { title });
      setTitle("");
      setAdding(false);
      fetchBoards();
    } catch (err) { console.error(err); }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Delete this board and all its tasks?")) return;
    try {
      await API.delete(`/boards/${id}`);
      fetchBoards();
    } catch (err) { console.error(err); }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={page}>
      {/* Hero */}
      <div style={hero}>
        <div style={heroLeft}>
          <div style={appBadge}>TaskZen</div>
          <h1 style={heroTitle}>{greeting}, {user?.name?.split(" ")[0]}!</h1>
          <p style={heroSub}>What are you working on today?</p>
        </div>
        <div style={heroRight}>
          <div style={statPill}>
            <span style={statNum}>{boards.length}</span>
            <span style={statLbl}>Boards</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={body}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>My Boards</h2>
          {!adding && (
            <button onClick={() => setAdding(true)} style={newBoardBtn}>
              + New Board
            </button>
          )}
        </div>

        {/* Add Board Form */}
        {adding && (
          <div style={addForm}>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createBoard()}
              placeholder="Enter board name..."
              style={addInput}
            />
            <button onClick={createBoard} style={saveBtn}>Create</button>
            <button onClick={() => setAdding(false)} style={cancelBtn}>Cancel</button>
          </div>
        )}

        {/* Empty State */}
        {boards.length === 0 && !adding ? (
          <div style={emptyState}>
            <div style={emptyIcon}></div>
            <h3 style={{ color: "#555", margin: "0 0 8px" }}>No boards yet</h3>
            <p style={{ color: "#aaa", margin: "0 0 20px" }}>
              Create your first board to start focusing!
            </p>
            <button onClick={() => setAdding(true)} style={emptyBtn}>
              + Create your first board
            </button>
          </div>
        ) : (
          <div style={grid}>
            {boards.map((board) => (
              <div
                key={board.id}
                style={{
                  ...card,
                  background: gradients[board.id % gradients.length],
                }}
              >
                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                  style={delBtn}
                  title="Delete board"
                >✕</button>

                {/* Card body */}
                <div onClick={() => navigate(`/board/${board.id}`)} style={cardClickable}>
                  <div style={cardIcon}>📋</div>
                  <h3 style={cardTitle}>{board.title}</h3>
                  <div style={cardFooter}>
                    <span style={cardOpenBtn}>Open Board →</span>
                    <span style={cardDate}>
                      {new Date(board.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Boards;

const page = {
  minHeight: "100vh",
  background: "#f4f6fb",
  paddingBottom: "90px",
  fontFamily: "Arial, sans-serif",
};

const hero = {
  background: "linear-gradient(145deg, #a462e1 0%, #b489dc 50%, #ba99d9 100%)",
  padding: "40px 30px 50px",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
};

const heroLeft  = {};
const heroRight = {};

const appBadge = {
  display: "inline-block",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "20px",
  padding: "4px 14px",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
};

const heroTitle = { margin: "0 0 6px", fontSize: "28px", fontWeight: "800" };
const heroSub   = { margin: 0, opacity: 0.7, fontSize: "14px" };

const statPill = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(6px)",
  borderRadius: "16px",
  padding: "16px 24px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.2)",
};

const statNum = { display: "block", fontSize: "30px", fontWeight: "800" };
const statLbl = { fontSize: "12px", opacity: 0.8 };

const body = {
  padding: "28px 24px 0",
  maxWidth: "1100px",
  margin: "auto",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const sectionTitle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#2f3542",
};

const newBoardBtn = {
  padding: "10px 18px",
  background: "linear-gradient(135deg, #f6cf6b, #f2ae02)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const addForm = {
  display: "flex",
  gap: "10px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const addInput = {
  flex: 1,
  minWidth: "200px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1.5px solid #ddd",
  fontSize: "14px",
  outline: "none",
};

const saveBtn = {
  padding: "12px 20px",
  background: "#3742fa",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const cancelBtn = {
  padding: "12px 16px",
  background: "#eee",
  color: "#333",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
  gap: "20px",
};

const card = {
  borderRadius: "16px",
  padding: "20px",
  minHeight: "155px",
  position: "relative",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const cardClickable = {
  cursor: "pointer",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const cardIcon  = { fontSize: "28px", marginBottom: "10px" };
const cardTitle = { margin: "0 0 auto", fontSize: "16px", fontWeight: "700", color: "#1e1e2e" };

const cardFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "18px",
};

const cardOpenBtn = { fontSize: "12px", fontWeight: "600", color: "#1e1e2e", opacity: 0.7 };
const cardDate    = { fontSize: "11px", color: "#1e1e2e", opacity: 0.5 };

const delBtn = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "rgba(0,0,0,0.15)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "26px",
  height: "26px",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
};

const emptyIcon = { fontSize: "64px", marginBottom: "16px" };

const emptyBtn = {
  padding: "12px 24px",
  background: "linear-gradient(135deg, #3742fa, #6c5ce7)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};
