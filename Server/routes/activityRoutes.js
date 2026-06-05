const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getActivity, clearActivity } = require("../controllers/activityController");

router.get("/", auth, getActivity);
router.delete("/clear", auth, clearActivity);

module.exports = router;
