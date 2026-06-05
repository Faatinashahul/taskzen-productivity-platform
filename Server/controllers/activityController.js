const db = require("../config/db");

exports.getActivity = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT a.*, t.title AS task_title
     FROM activity a
     LEFT JOIN tasks t ON a.task_id = t.id
     WHERE a.user_id = ?
     ORDER BY a.created_at DESC
     LIMIT 50`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

exports.clearActivity = (req, res) => {
  const userId = req.user.id;
  db.query("DELETE FROM activity WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Activity cleared" });
  });
};
