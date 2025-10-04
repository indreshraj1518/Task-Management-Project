// src/components/TaskForm.jsx
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import dayjs from "dayjs";

export default function TaskForm({ initial = {}, onSuccess }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [dueDate, setDueDate] = useState(
    initial.dueDate ? dayjs(initial.dueDate).format("YYYY-MM-DD") : ""
  );
  const [priority, setPriority] = useState(initial.priority || "medium");
  const [assignedTo, setAssignedTo] = useState(
    initial.assignedTo?.username || ""
  );
  const [allUsers, setAllUsers] = useState([]); // fetch all users for dropdown

  useEffect(() => {
    // fetch all users (admin only)
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/users");
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    // Check if assigned user exists
    const userObj = allUsers.find((u) => u.username === assignedTo);
    if (!userObj) {
      alert("User does not exist. Please provide a valid username.");
      return;
    }

    const payload = {
      title,
      description,
      dueDate,
      priority,
      assignedTo: userObj._id, // backend expects userId
    };

    try {
      if (initial._id) {
        await axiosClient.put(`/tasks/${initial._id}`, payload);
      } else {
        await axiosClient.post("/tasks", payload);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving task");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 p-4 bg-white rounded shadow">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded outline-none border-gray-300"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border rounded outline-none border-gray-300"
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded outline-none border-gray-300"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded outline-none border-gray-300"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Assign to User (Admin only) */}
      <input
        type="text"
        list="users-list"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        placeholder="Assign to username"
        className="w-full p-2 border rounded outline-none border-gray-300"
      />
      <datalist id="users-list">
        {allUsers.map((user) => (
          <option key={user._id} value={user.username} />
        ))}
      </datalist>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
