const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const {
  createTask, getTasks, moveTask,
  reorderTasks, deleteTask, getAllTasksWithDates,
} = require("../controllers/taskController");

router.post("/create", auth, createTask);

router.get("/inbox", auth, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE is_inbox = TRUE AND user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

router.get("/all", auth, getAllTasksWithDates);
router.get("/:columnId", getTasks);
router.put("/move/:taskId", auth, moveTask);
router.put("/reorder", auth, reorderTasks);
router.delete("/:id", auth, deleteTask);

module.exports = router;
