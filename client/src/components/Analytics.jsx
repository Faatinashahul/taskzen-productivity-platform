import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Analytics = ({ tasks, completedColumnId }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // ✅ Completion
  const totalTasks = safeTasks.length;

  const completedTasks = safeTasks.filter(
    (task) => task.column_id === completedColumnId
  ).length;

  const completionRate =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // ✅ Tasks per day
  const tasksPerDay = {};

  safeTasks.forEach((task) => {
    if (!task.due_date) return;

    const date = new Date(task.due_date)
      .toISOString()
      .split("T")[0];

    if (!tasksPerDay[date]) {
      tasksPerDay[date] = 0;
    }

    tasksPerDay[date]++;
  });

  const chartData = Object.keys(tasksPerDay).map((date) => ({
    date,
    tasks: tasksPerDay[date],
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 Analytics Dashboard</h2>

      {/* TOP CARDS */}
      <div style={cardContainer}>
        <div style={card}>
          <h4>Total Tasks</h4>
          <h2>{totalTasks}</h2>
        </div>

        <div style={card}>
          <h4>Completed</h4>
          <h2>{completedTasks}</h2>
        </div>

        <div style={card}>
          <h4>Completion</h4>
          <div style={{ width: "100px", margin: "auto" }}>
            <CircularProgressbar
              value={completionRate}
              text={`${completionRate.toFixed(0)}%`}
            />
          </div>
        </div>
      </div>

      {/* LINE CHART */}
      <div style={chartBox}>
        <h4>Tasks Over Time</h4>

        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="tasks" stroke="#6c5ce7" />
        </LineChart>
      </div>
    </div>
  );
};

export default Analytics;

/* ---------- STYLES ---------- */

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  flex: 1,
  padding: "20px",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const chartBox = {
  padding: "20px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};