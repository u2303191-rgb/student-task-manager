import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({});

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
    const handler = () => fetchTasks();
    window.addEventListener("tasksUpdated", handler);
    return () => window.removeEventListener("tasksUpdated", handler);
  }, []);

  const removeTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEdit({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.substr(0, 10) : "",
      status: task.status,
    });
  };

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, edit);
    setEditingId(null);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      status: task.status === "Pending" ? "Completed" : "Pending",
    });
    fetchTasks();
  };

  return (
    <div>
      <h3>All Tasks</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>
                {editingId === t._id ? (
                  <input
                    value={edit.title}
                    onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  />
                ) : (
                  t.title
                )}
              </td>
              <td>
                {editingId === t._id ? (
                  <input
                    value={edit.description}
                    onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  />
                ) : (
                  t.description
                )}
              </td>
              <td>
                {editingId === t._id ? (
                  <input
                    type="date"
                    value={edit.dueDate}
                    onChange={(e) => setEdit({ ...edit, dueDate: e.target.value })}
                  />
                ) : t.dueDate ? (
                  new Date(t.dueDate).toLocaleDateString()
                ) : (
                  ""
                )}
              </td>
              <td>
                {editingId === t._id ? (
                  <select
                    value={edit.status}
                    onChange={(e) => setEdit({ ...edit, status: e.target.value })}
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                ) : (
                  t.status
                )}
              </td>
              <td>
                {editingId === t._id ? (
                  <>
                    <button onClick={() => saveEdit(t._id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button onClick={() => removeTask(t._id)}>Delete</button>
                    <button onClick={() => toggleStatus(t)}>
                      {t.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
