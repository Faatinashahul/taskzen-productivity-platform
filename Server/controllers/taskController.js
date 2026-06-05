const db = require("../config/db");

// Create Task
exports.createTask = (req, res) => {
  let { title, description = "", column_id, due_date, is_inbox = 0 } = req.body;
  const userId = req.user.id;

  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!is_inbox && !column_id)
    return res.status(400).json({ message: "column_id required for board tasks" });

  if (!due_date || due_date === "") due_date = null;
  const finalColumnId = is_inbox ? null : column_id;

  db.query(
    "INSERT INTO tasks (title, description, column_id, user_id, position, due_date, is_inbox) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, description, finalColumnId, userId, 0, due_date, is_inbox ? 1 : 0],
    (err, result) => {
      if (err) { console.error(err); return res.status(500).json(err); }

      const taskId = result.insertId;
      db.query(
        "INSERT INTO activity (message, task_id, user_id) VALUES (?, ?, ?)",
        [`Task created: ${title}`, taskId, userId]
      );
      res.json({ message: "Task created", id: taskId });
    }
  );
};

// Get Tasks by Column
exports.getTasks = (req, res) => {
  const columnId = req.params.columnId;
  db.query(
    "SELECT * FROM tasks WHERE column_id = ? ORDER BY position ASC",
    [columnId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// All tasks with due dates (Planner) — scoped to user
exports.getAllTasksWithDates = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT t.*, c.title AS column_title, b.title AS board_title
     FROM tasks t
     LEFT JOIN \`columns\` c ON t.column_id = c.id
     LEFT JOIN boards b ON c.board_id = b.id
     WHERE t.due_date IS NOT NULL AND t.user_id = ?
     ORDER BY t.due_date ASC`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// Move Task
exports.moveTask = (req, res) => {
  const { taskId } = req.params;
  const { column_id } = req.body;
  const userId = req.user.id;

  db.query("UPDATE tasks SET column_id = ? WHERE id = ?", [column_id, taskId], (err) => {
    if (err) return res.status(500).json(err);
    db.query(
      "INSERT INTO activity (message, task_id, user_id) VALUES (?, ?, ?)",
      [`Task moved to column ${column_id}`, taskId, userId]
    );
    res.json({ message: "Task moved successfully" });
  });
};

// Reorder tasks
exports.reorderTasks = (req, res) => {
  const { tasks } = req.body;
  const updates = tasks.map((task, index) =>
    new Promise((resolve, reject) => {
      db.query("UPDATE tasks SET position = ? WHERE id = ?", [index + 1, task.id], (err) => {
        if (err) reject(err); else resolve();
      });
    })
  );
  Promise.all(updates)
    .then(() => res.json({ message: "Tasks reordered" }))
    .catch((err) => res.status(500).json(err));
};

// Delete Task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    db.query(
      "INSERT INTO activity (message, task_id, user_id) VALUES (?, ?, ?)",
      ["Task deleted", id, userId]
    );
    res.json({ message: "Task deleted" });
  });
};
