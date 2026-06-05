import { useEffect, useState } from "react";
import API from "../services/api";

const COLORS = [
  { hex: "#4FC1B6", name: "Greem"  },
  { hex: "#F6C445", name: "Yellow"   },
  { hex: "#4d96ff", name: "Blue"    },
  { hex: "#ff6b6b", name: "Red"     },
  { hex: "#c77dff", name: "Purple"  },
  { hex: "#F288B3", name: "Pink"  },
];

function darken(hex) {
  // Simple darken for text contrast on colored bg
  return "#1e1e2e";
}

function Notes() {
  const [notes, setNotes]     = useState([]);
  const [text, setText]       = useState("");
  const [color, setColor]     = useState(COLORS[0].hex);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!text.trim()) return;
    try {
      await API.post("/notes/add", { text, color });
      setText("");
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={page}>
      {/* Header */}
      <div style={heroStyle}>
        <div>
          <h1 style={heroTitle}>Ideas & Notes</h1>
          <p style={heroSub}>Capture thoughts before they disappear</p>
        </div>
        <div style={notesCountBadge}>{notes.length} notes</div>
      </div>

      {/* Add Note Card */}
      <div style={addCard}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write an idea, reminder, or anything on your mind..."
          style={{ ...textArea, background: color .replace(")", ", 0.9)").replace("rgb", "rgba")}}
          rows={3}
        />

        {/* Color Picker */}
        <div style={colorRow}>
          <span style={colorLabel}>Pick colour:</span>
          <div style={colorPills}>
            {COLORS.map((c) => (
              <div
                key={c.hex}
                onClick={() => setColor(c.hex)}
                title={c.name}
                style={{
                  ...colorDot,
                  background: c.hex,
                  border: color === c.hex
                    ? "3px solid #2f3542"
                    : "3px solid transparent",
                  transform: color === c.hex ? "scale(1.25)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <button onClick={addNote} style={addBtn}>
            + Add Note
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <p style={{ color: "#aaa", textAlign: "center" }}>Loading...</p>
      ) : notes.length === 0 ? (
        <div style={emptyState}>
          <div style={{ fontSize: "56px", marginBottom: "12px" }}>💭</div>
          <h3 style={{ color: "#555", margin: "0 0 6px" }}>No notes yet</h3>
          <p style={{ color: "#aaa", margin: 0 }}>
            Your next great idea is one tap away!
          </p>
        </div>
      ) : (
        <div style={notesGrid}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{ ...noteCard, background: note.color || "#ffd93d" }}
            >
              {/* Delete */}
              <button
                onClick={() => deleteNote(note.id)}
                style={deleteBtn}
                title="Delete note"
              >✕</button>

              {/* Note text */}
              <p style={noteText}>{note.text}</p>

              {/* Timestamp */}
              <div style={noteTime}>
                {new Date(note.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;

const page = {
  padding: "0 0 100px",
  minHeight: "100vh",
  background: "#f4f6fb",
  fontFamily: "Arial, sans-serif",
};

const heroStyle = {
  background: "linear-gradient(145deg, #a462e1 0%, #b489dc 50%, #ba99d9 100%)",
  padding: "36px 28px 40px",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "24px",
};

const heroTitle = { margin: "0 0 6px", fontSize: "24px", fontWeight: "800" };
const heroSub   = { margin: 0, opacity: 0.7, fontSize: "13px" };

const notesCountBadge = {
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  padding: "8px 18px",
  fontSize: "14px",
  fontWeight: "700",
};

const addCard = {
  margin: "0 20px 28px",
  background: "#fff",
  borderRadius: "16px",
  padding: "16px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const textArea = {
  width: "100%",
  border: "none",
  borderRadius: "10px",
  padding: "14px",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  resize: "none",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: "12px",
  color: "#1e1e2e",
  fontWeight: "500",
};

const colorRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const colorLabel = {
  fontSize: "12px",
  color: "#888",
  fontWeight: "600",
};

const colorPills = {
  display: "flex",
  gap: "8px",
  flex: 1,
};

const colorDot = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "transform 0.15s, border 0.15s",
};

const addBtn = {
  padding: "9px 20px",
  background: "linear-gradient(135deg, #3742fa, #6c5ce7)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const notesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "16px",
  padding: "0 20px",
};

const noteCard = {
  borderRadius: "14px",
  padding: "16px",
  position: "relative",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s",
};

const noteText = {
  margin: "0 20px 12px 0",
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e1e2e",
  lineHeight: "1.5",
  wordBreak: "break-word",
  flex: 1,
};

const noteTime = {
  fontSize: "10px",
  color: "rgba(30,30,46,0.5)",
  marginTop: "8px",
};

const deleteBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "rgba(0,0,0,0.12)",
  color: "#1e1e2e",
  border: "none",
  borderRadius: "50%",
  width: "22px",
  height: "22px",
  cursor: "pointer",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
};
