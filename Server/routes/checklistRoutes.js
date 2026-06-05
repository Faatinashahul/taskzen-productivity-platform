const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addItem, getItems, toggleItem } = require("../controllers/checklistController");

router.post("/add", auth, addItem);
router.get("/:taskId", auth, getItems);
router.put("/toggle/:id", auth, toggleItem);

module.exports = router;
