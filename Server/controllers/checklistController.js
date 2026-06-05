const db = require("../config/db");

// Add checklist item
exports.addItem = (req, res) => {
  const { text, task_id } = req.body;

  const query = "INSERT INTO checklist (text, task_id) VALUES (?, ?)";

  db.query(query, [text, task_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Item added", id: result.insertId });
  });
};

// Get checklist items for a task
exports.getItems = (req, res) => {
  const taskId = req.params.taskId;

  const query = "SELECT * FROM checklist WHERE task_id = ?";

  db.query(query, [taskId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// Toggle complete
exports.toggleItem = (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE checklist 
    SET is_completed = NOT is_completed 
    WHERE id = ?
  `;

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Item updated" });
  });
};