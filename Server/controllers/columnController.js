const db = require("../config/db");

// Create Column
exports.createColumn = (req, res) => {
  const { title, board_id } = req.body;

  if (!title || !board_id) {
    return res.status(400).json({ message: "title and board_id required" });
  }

  const query = "INSERT INTO `columns` (title, board_id) VALUES (?, ?)";

  db.query(query, [title, board_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Column created", id: result.insertId });
  });
};

// Get Columns by Board
exports.getColumns = (req, res) => {
  const boardId = req.params.boardId;
  const query = "SELECT * FROM `columns` WHERE board_id = ? ORDER BY id ASC";

  db.query(query, [boardId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Delete Column
exports.deleteColumn = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM `columns` WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Column deleted" });
  });
};
