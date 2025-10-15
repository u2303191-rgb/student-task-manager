import React, { useState } from "react";
import axios from "axios";

export default function TaskForm() {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTask = async () => {
    if (!form.title) return alert("Title is required!");
    await axios.post("http://localhost:5000/api/tasks", form);
    setForm({ title: "", description: "", dueDate: "" });
    window.dispatchEvent(new Event("tasksUpdated")); // triggers task list refresh
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Add Task</h3>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        style={{ marginRight: 5 }}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        style={{ marginRight: 5 }}
      />
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        style={{ marginRight: 5 }}
      />
      <button onClick={submitTask}>Add</button>
    </div>
  );
}
