const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const db             = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const boardRoutes    = require("./routes/boardRoutes");
const columnRoutes   = require("./routes/columnRoutes");
const taskRoutes     = require("./routes/taskRoutes");
const checklistRoutes= require("./routes/checklistRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notesRoutes    = require("./routes/notesRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",      authRoutes);
app.use("/api/boards",    boardRoutes);
app.use("/api/columns",   columnRoutes);
app.use("/api/tasks",     taskRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/activity",  activityRoutes);
app.use("/api/notes",     notesRoutes);

app.get("/", (req, res) => res.send("Focusly server running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
