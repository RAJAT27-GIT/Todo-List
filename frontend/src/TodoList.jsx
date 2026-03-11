import React, { useState, useEffect } from "react";

function TodoList() {
  const [Tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // ✅ Fetch tasks from backend on load
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // ✅ Add new task
  const add = async () => {
    if (!newTitle || !newDesc) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, desc: newDesc }),
    });

    const data = await res.json();
    setTasks([...Tasks, data]);
    setNewTitle("");
    setNewDesc("");
  };

  // ✅ Mark complete
  const markComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}/complete`, {
      method: "PUT",
    });
    const updated = await res.json();
    setTasks(Tasks.map((t) => (t._id === id ? updated : t)));
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(Tasks.filter((t) => t._id !== id));
  };

  // ✅ Start edit
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.desc);
  };

  // ✅ Save edit
  const saveEdit = async () => {
    const res = await fetch(`http://localhost:5000/tasks/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, desc: editDesc }),
    });
    const updated = await res.json();

    setTasks(Tasks.map((t) => (t._id === editId ? updated : t)));
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
  };

  return (
    <div className="todo-container">
      <h2>📌 Todo List</h2>

      <ul className="task-list">
        {Tasks.map((e) => (
          <li key={e._id}>
            {editId === e._id ? (
              <div className="edit-section">
                <input type="text" value={editTitle} onChange={(ev) => setEditTitle(ev.target.value)} placeholder="Enter title" />
                <textarea rows="3" value={editDesc} onChange={(ev) => setEditDesc(ev.target.value)} placeholder="Enter description..."/>
                <div>
                  <button onClick={saveEdit}>💾 Save </button>
                  <button onClick={() => setEditId(null)}>❌ Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h4>{e.title}</h4>
                <p>{e.desc}</p>
                <span>
                  {e.complete ? "✅ Completed" : "⏳ Pending"}
                </span>
                <div >
                  {!e.complete ? (<button onClick={() => markComplete(e._id)}> ✅ Complete </button>
                  ) : (
                    <button onClick={() => deleteTask(e._id)}> 🗑️ Delete </button>
                  )}
                  <button onClick={() => startEdit(e)}>✏️ Edit</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="add-section">
        <h3>Add New Task</h3>
        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title"/>
        <textarea rows="3" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" />
        <button onClick={add}>➕ Add Task</button>
      </div>
    </div>
  );
}

export default TodoList;
