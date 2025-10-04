// src/pages/TaskDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function TaskDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await axiosClient.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch task");
      navigate("/tasks");
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosClient.delete(`/tasks/${id}`);
      alert("Task deleted");
      navigate("/tasks");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const toggleStatus = async () => {
    if (!task) return;
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await axiosClient.put(`/tasks/${id}`, { status: newStatus });
      fetchTask();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  if (!task) return <div className="p-6">Loading...</div>;

  // Determine permissions
  const canEdit =
    user?.role === "admin" ||
    (task.assignedTo && task.assignedTo._id === user?._id);
  const canDelete = user?.role === "admin";
  const canToggleStatus = canEdit; // assigned user or admin can toggle

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
      <p className="text-sm text-gray-700 mb-2">{task.description}</p>
      <p className="text-xs text-gray-500 mb-2">
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
      </p>
      <p className="text-sm mb-2">Priority: {task.priority}</p>
      <p className="text-sm mb-2">
        Assigned to: {task.assignedTo?.username || "Unassigned"}
      </p>
      <p className="text-sm font-semibold mb-4">Status: {task.status}</p>

      <div className="flex gap-2">
        {canToggleStatus && (
          <button
            onClick={toggleStatus}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Toggle Status
          </button>
        )}

        {canEdit && (
          <button
            onClick={() => navigate(`/tasks/${id}/edit`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        )}

        {canDelete && (
          <button
            onClick={deleteTask}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
