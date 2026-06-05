const db = require("../config/db");

// Get all notes for user
exports.getNotes = (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// Add note
exports.addNote = (req, res) => {
  const { text, color } = req.body;
  const userId = req.user.id;

  if (!text || !text.trim())
    return res.status(400).json({ message: "Note text is required" });

  db.query(
    "INSERT INTO notes (text, color, user_id) VALUES (?, ?, ?)",
    [text.trim(), color || "#ffd93d", userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Note added", id: result.insertId });
    }
  );
};

// Delete note
exports.deleteNote = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Note deleted" });
    }
  );
};
