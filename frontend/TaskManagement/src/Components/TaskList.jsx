// src/pages/TaskList.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosClient.get("/tasks");
      // backend already filters tasks based on user role
      setTasks(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosClient.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await axiosClient.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(tasks.length / tasksPerPage));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {currentTasks.length === 0 && <p>No tasks to show.</p>}

      <div className="space-y-4">
        {currentTasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 border rounded shadow-sm ${
              task.priority === "high"
                ? "bg-red-50"
                : task.priority === "medium"
                ? "bg-yellow-50"
                : "bg-green-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {task.description?.slice(0, 120)}
                </p>
                <p className="text-xs text-gray-500">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  Assigned to: {task.assignedTo?.username || "Unassigned"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium">{task.status}</span>

                <div className="flex gap-2">
                  {/* View button always available */}
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>

                  {/* Edit: admin or assigned user */}
                  {(user?.role === "admin" ||
                    task.assignedTo?._id === user?._id) && (
                    <button
                      onClick={() => navigate(`/tasks/${task._id}/edit`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}

                  {/* Delete: admin only */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Toggle status */}
                <button
                  onClick={() => toggleStatus(task)}
                  className="text-sm bg-sky-200 px-2 py-1 rounded"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-3 justify-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
