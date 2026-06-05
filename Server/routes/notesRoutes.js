const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const { getNotes, addNote, deleteNote } = require("../controllers/notesController");

router.get("/",        auth, getNotes);
router.post("/add",    auth, addNote);
router.delete("/:id",  auth, deleteNote);

module.exports = router;
