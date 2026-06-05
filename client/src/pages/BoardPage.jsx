import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Analytics from "../components/Analytics";
import API from "../services/api";
import Checklist from "../components/Checklist";

const colColors = {
  "Todo":        { header: "#F28BB3", light: "#eef0ff" },
  "In Progress": { header: "#F47C5C", light: "#fff8ee" },
  "Completed":   { header: "#4FC1B6", light: "#efffee" },
};

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boardTitle, setBoardTitle] = useState("Board");
  const [columns, setColumns]       = useState([]); // [{ ...col, tasks: [] }]
  const [inputs, setInputs]         = useState({}); // { colId: { title, dueDate } }

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [boardsRes, colsRes] = await Promise.all([
        API.get("/boards"),
        API.get(`/columns/${id}`),
      ]);

      const board = boardsRes.data.find((b) => b.id === parseInt(id));
      if (board) setBoardTitle(board.title);

      const cols = colsRes.data;

      // Fetch tasks for all columns in parallel
      const taskResults = await Promise.all(
        cols.map((col) => API.get(`/tasks/${col.id}`))
      );

      const enriched = cols.map((col, i) => ({
        ...col,
        tasks: taskResults[i].data,
      }));

      setColumns(enriched);

      // Init input state for each column
      const initInputs = {};
      cols.forEach((col) => {
        initInputs[col.id] = { title: "", dueDate: "" };
      });
      setInputs(initInputs);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Optimistic drag — move card in UI instantly, then sync with server
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceColId = parseInt(source.droppableId);
    const destColId   = parseInt(destination.droppableId);

    // Deep clone columns
    const newCols = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));

    const sourceCol = newCols.find((c) => c.id === sourceColId);
    const destCol   = newCols.find((c) => c.id === destColId);
    const taskId    = parseInt(draggableId);

    // Remove from source
    const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
    const [task]    = sourceCol.tasks.splice(taskIndex, 1);

    // Insert into destination
    task.column_id = destColId;
    destCol.tasks.splice(destination.index, 0, task);

    // Update UI immediately
    setColumns(newCols);

    // Sync with server in background
    API.put(`/tasks/move/${taskId}`, { column_id: destColId }).catch((err) => {
      console.error("Move failed, reverting", err);
      fetchAll(); // revert on error
    });
  };

  const addTask = async (colId) => {
    const input = inputs[colId];
    if (!input?.title?.trim()) return;

    try {
      await API.post("/tasks/create", {
        title: input.title,
        description: "",
        column_id: colId,
        due_date: input.dueDate || null,
        is_inbox: false,
      });

      setInputs((prev) => ({
        ...prev,
        [colId]: { title: "", dueDate: "" },
      }));

      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInput = (colId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [colId]: { ...prev[colId], [field]: value },
    }));
  };

  const completedColumn = columns.find(
    (col) => col.title === "Completed"
  );

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button onClick={() => navigate("/boards")} style={backBtn}>← Back</button>
        <h2 style={{ margin: 0, color: "#2f3542" }}>{boardTitle}</h2>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={boardWrapper}>
          {columns.map((col) => {
            const colors = colColors[col.title] || { header: "#888", light: "#f9f9f9" };
            const input  = inputs[col.id] || { title: "", dueDate: "" };

            return (
              <div key={col.id} style={{ ...columnStyle, background: colors.light }}>
                {/* Column Header */}
                <div style={{ ...colHeader, background: colors.header }}>
                  <span style={colTitle}>{col.title}</span>
                  <span style={countBadge}>{col.tasks.length}</span>
                </div>

                {/* Droppable task list */}
                <Droppable droppableId={String(col.id)}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        ...taskListStyle,
                        background: snapshot.isDraggingOver
                          ? "rgba(55,66,250,0.07)"
                          : "transparent",
                        borderRadius: "8px",
                        transition: "background 0.15s",
                        minHeight: "60px",
                      }}
                    >
                      {col.tasks.map((task, index) => {
                        const today = new Date(); today.setHours(0,0,0,0);
                        const due   = task.due_date ? new Date(task.due_date) : null;
                        if (due) due.setHours(0,0,0,0);

                        let status = "", borderColor = "#ddd";
                        const isCompleted = col.title === "Completed"; // 👈 ADD THIS

                        if (due && !isCompleted) {
                          if (due < today)                            { status = "Overdue";   borderColor = "#ff6b6b"; }
                          else if (due.getTime() === today.getTime()) { status = "Due Today"; borderColor = "#ffa502"; }
                          else                                        { status = "Upcoming";  borderColor = "#2ed573"; }
                        }

                        return (
                          <Draggable
                            key={String(task.id)}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...taskCard,
                                  borderLeft: `4px solid ${borderColor}`,
                                  boxShadow: snapshot.isDragging
                                    ? "0 12px 32px rgba(0,0,0,0.2)"
                                    : "0 2px 6px rgba(0,0,0,0.07)",
                                  opacity: snapshot.isDragging ? 0.95 : 1,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  style={taskDelBtn}
                                >✕</button>

                                <div style={taskTitleStyle}>{task.title}</div>

                                {task.due_date && (
                                  <div style={{ fontSize: "11px", color: borderColor, marginTop: "5px" }}>
                                    📅 {new Date(task.due_date).toLocaleDateString("en-IN", {
                                      day: "numeric", month: "short",
                                    })} · {status}
                                  </div>
                                )}

                                <Checklist
                                  taskId={task.id}
                                  completedColumnId={
                                    columns.find(col => col.title === "Completed")?.id
                                  }
                                  refreshBoard={fetchAll}
                                />
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
                    value={input.title}
                    onChange={(e) => handleInput(col.id, "title", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask(col.id)}
                    placeholder="Add a task..."
                    style={inputStyle}
                  />
                  <input
                    type="datetime-local"
                    value={input.dueDate}
                    onChange={(e) => handleInput(col.id, "dueDate", e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    onClick={() => addTask(col.id)}
                    style={{ ...addBtn, background: colors.header }}
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    {columns.length > 0 && (
      <Analytics
        tasks={columns.flatMap(col => col.tasks || [])}
        completedColumnId={completedColumn?.id}
      />
    )}
    </div>
  );
}

export default BoardPage;

const pageStyle = {
  padding: "20px 20px 90px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f4f6fb, #e8ecf8)",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
};

const backBtn = {
  padding: "8px 14px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#333",
};

const boardWrapper = {
  display: "flex",
  gap: "24px",
  overflowX: "auto",
  paddingBottom: "20px",
  justifyContent: "center",
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const columnStyle = {
  width: "300px",
  minWidth: "300px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
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
  maxHeight: "55vh",
};

const taskCard = {
  background: "#fff",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "10px",
  position: "relative",
  cursor: "grab",
  userSelect: "none",
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
