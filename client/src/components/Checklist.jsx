import { useEffect, useState } from "react";
import API from "../services/api";

function Checklist({ taskId, completedColumnId }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  const fetchItems = async () => {
    const res = await API.get(`/checklist/${taskId}`);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!text) return;

    await API.post("/checklist/add", {
      text,
      task_id: taskId,
    });

    setText("");
    fetchItems();
  };

  const toggleItem = async (id) => {
    await API.put(`/checklist/toggle/${id}`);
    fetchItems();
  };

  // ✅ Progress logic
  const total = items.length;
  const completed = items.filter((item) => item.is_completed).length;
  const allDone = total > 0 && total === completed;

  // 🔥 AUTO MOVE TO COMPLETED
  useEffect(() => {
    if (allDone && completedColumnId) {
      moveToCompleted();
    }
  }, [allDone]);

  const moveToCompleted = async () => {
    try {
      await API.put(`/tasks/move/${taskId}`, {
        column_id: completedColumnId,
      });

      // 🔥 refresh UI (simple method)
      const moveToCompleted = async () => {
        try {
          await API.put(`/tasks/move/${taskId}`, {
            column_id: completedColumnId,
          });

          refreshBoard(); // ✅ smooth update
        } catch (err) {
          console.error(err);
        }
      };
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        style={{
          fontSize: "12px",
          marginTop: "5px",
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
        }}
      >
        {show ? "Hide Checklist ▲" : "Show Checklist ▼"}
      </button>

      {/* Checklist UI */}
      {show && (
        <>
          <div style={{ marginTop: "5px" }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add item"
              style={{ marginRight: "5px" }}
            />
            <button onClick={addItem}>Add</button>
          </div>

          {/* Progress */}
          <p style={{ fontSize: "12px" }}>
            {completed} / {total} completed
          </p>

          {/* Completed message */}
          {allDone && (
            <p style={{ color: "green", fontSize: "12px" }}>
              ✔ All tasks completed
            </p>
          )}

          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <input
                  type="checkbox"
                  checked={item.is_completed}
                  onChange={() => toggleItem(item.id)}
                />
                {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Checklist;