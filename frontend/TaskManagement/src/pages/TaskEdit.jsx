// src/pages/TaskEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function TaskEdit({ user }) {
  const { id } = useParams(); // id may be 'new' if you decide to support new creation here
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    assignedTo: "",
    status: "pending",
  });
  const [users, setUsers] = useState([]); // for admin to assign

  useEffect(() => {
    if (id) fetchTask();
    if (user?.role === "admin") fetchUsers();
    // eslint-disable-next-line
  }, [id, user]);

  const fetchTask = async () => {
    try {
      const res = await axiosClient.get(`/tasks/${id}`);
      const data = res.data;
      setTask({
        title: data.title || "",
        description: data.description || "",
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        priority: data.priority || "low",
        assignedTo: data.assignedTo?._id || "",
        status: data.status || "pending",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch task");
      navigate("/tasks");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (err) {
      // ignore if not admin or error
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Normal users may only edit title, description, dueDate.
      const payload = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate || null,
      };

      // Admin can also edit priority, status, assignedTo
      if (user?.role === "admin") {
        payload.priority = task.priority;
        payload.status = task.status;
        payload.assignedTo = task.assignedTo || null;
      }

      await axiosClient.put(`/tasks/${id}`, payload);
      alert("Task saved");
      navigate(`/tasks/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={task.title}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          value={task.description}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={task.dueDate}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, dueDate: e.target.value }))
          }
          className="p-2 border rounded w-full"
        />

        {/* Admin-only controls */}
        {user?.role === "admin" && (
          <>
            <select
              value={task.priority}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={task.status}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={task.assignedTo}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
