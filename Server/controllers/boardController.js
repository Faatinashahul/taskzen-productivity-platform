const db = require("../config/db");

// Create Board — auto-creates 3 fixed columns
exports.createBoard = (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  if (!title) return res.status(400).json({ message: "Title required" });

  db.query(
    "INSERT INTO boards (title, user_id) VALUES (?, ?)",
    [title, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const boardId = result.insertId;

      // Auto-create 3 fixed columns
      const cols = [
        ["Todo", boardId, 1],
        ["In Progress", boardId, 2],
        ["Completed", boardId, 3],
      ];

      db.query(
        "INSERT INTO `columns` (title, board_id, position) VALUES ?",
        [cols],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Board created", id: boardId });
        }
      );
    }
  );
};

// Get All Boards for logged-in user
exports.getBoards = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// Delete Board
exports.deleteBoard = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    "DELETE FROM boards WHERE id = ? AND user_id = ?",
    [id, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Board deleted" });
    }
  );
};
