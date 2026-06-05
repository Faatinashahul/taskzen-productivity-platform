const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createBoard, getBoards, deleteBoard } = require("../controllers/boardController");

router.post("/create", auth, createBoard);
router.get("/", auth, getBoards);
router.delete("/:id", auth, deleteBoard);

module.exports = router;
