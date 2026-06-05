import { useEffect, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";
import Checklist from "./Checklist";

const colColors = {
  "Todo":        { header: "#F28BB3", light: "#eef0ff" },
  "In Progress": { header: "#F47C5C", light: "#fff8ee" },
  "Completed":   { header: "#4FC1B6", light: "#efffee" },
};

function Column({ column, onRefresh }) {
  const [tasks, setTasks]   = useState([]);
  const [title, setTitle]   = useState("");
  const [dueDate, setDueDate] = useState("");

  const colors = colColors[column.title] || { header: "#888", light: "#f9f9f9" };

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${column.id}`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await API.post("/tasks/create", {
        title,
        description: "",
        column_id: column.id,
        due_date: dueDate || null,
        is_inbox: false,
      });
      setTitle("");
      setDueDate("");
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ ...columnStyle, background: colors.light }}>
      {/* Column Header */}
      <div style={{ ...colHeader, background: colors.header }}>
        <span style={colTitle}>{column.title}</span>
        <span style={countBadge}>{tasks.length}</span>
      </div>

      {/* Droppable Task Area */}
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...taskListStyle,
              background: snapshot.isDraggingOver
                ? "rgba(55,66,250,0.06)"
                : "transparent",
              borderRadius: "8px",
              transition: "background 0.2s",
            }}
          >
            {tasks.map((task, index) => {
              const today = new Date(); today.setHours(0,0,0,0);
              const due   = task.due_date ? new Date(task.due_date) : null;
              if (due) due.setHours(0,0,0,0);

              let status = "", borderColor = "#ddd";
              if (due) {
                if (due < today)                         { status = "Overdue";   borderColor = "#ff6b6b"; }
                else if (due.getTime() === today.getTime()) { status = "Due Today"; borderColor = "#ffa502"; }
                else                                     { status = "Upcoming";  borderColor = "#2ed573"; }
              }

              return (
                <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...taskCard,
                        borderLeft: `4px solid ${borderColor}`,
                        boxShadow: snapshot.isDragging
                          ? "0 10px 28px rgba(0,0,0,0.18)"
                          : "0 2px 6px rgba(0,0,0,0.07)",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <button onClick={() => deleteTask(task.id)} style={taskDelBtn}>✕</button>

                      <div style={taskTitleStyle}>{task.title}</div>

                      {task.due_date && (
                        <div style={{ fontSize: "11px", color: borderColor, marginTop: "5px" }}>
                          📅 {new Date(task.due_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short"
                          })} · {status}
                        </div>
                      )}

                      <Checklist taskId={task.id} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Form */}
      <div style={formStyle}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          style={inputStyle}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addTask} style={{ ...addBtn, background: colors.header }}>
          + Add Task
        </button>
      </div>
    </div>
  );
}

export default Column;

const columnStyle = {
  width: "300px",
  minWidth: "300px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "82vh",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const colHeader = {
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const colTitle = {
  color: "white",
  fontWeight: "700",
  fontSize: "15px",
};

const countBadge = {
  background: "rgba(255,255,255,0.25)",
  color: "white",
  borderRadius: "20px",
  padding: "2px 10px",
  fontSize: "12px",
  fontWeight: "700",
};

const taskListStyle = {
  flexGrow: 1,
  overflowY: "auto",
  padding: "12px",
  minHeight: "60px",
};

const taskCard = {
  background: "#fff",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "10px",
  position: "relative",
  cursor: "grab",
  transition: "box-shadow 0.2s",
};

const taskTitleStyle = {
  fontWeight: "600",
  fontSize: "14px",
  paddingRight: "22px",
  color: "#2f3542",
};

const taskDelBtn = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "rgba(255,107,107,0.12)",
  color: "#ff6b6b",
  border: "none",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  cursor: "pointer",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const formStyle = {
  padding: "12px",
  borderTop: "1px solid rgba(0,0,0,0.06)",
  background: "rgba(255,255,255,0.6)",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  marginBottom: "8px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "13px",
  boxSizing: "border-box",
  outline: "none",
};

const addBtn = {
  width: "100%",
  padding: "9px",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
};
