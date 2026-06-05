const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getColumns } = require("../controllers/columnController");

// Only GET needed — columns are auto-created with boards now
router.get("/:boardId", auth, getColumns);

module.exports = router;
