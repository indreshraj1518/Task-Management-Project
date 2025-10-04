// src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TaskList from "./Components/TaskList";
import TaskDetails from "./pages/TaskDetails";
import TaskEdit from "./pages/TaskEdit";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserList from "./Components/UserList";

function App() {
  // global user state (loaded from localStorage)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Admin dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true} user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Tasks list (logged-in users) */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute user={user}>
              <TaskList user={user} />
            </ProtectedRoute>
          }
        />

        {/* Task details */}
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute user={user}>
              <TaskDetails user={user} />
            </ProtectedRoute>
          }
        />

        {/* Edit: only admin OR user assigned (but route protected for admin edit pages too) */}
        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <TaskEdit user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly={true} user={user}>
              <UserList /> {/* ek naya component jo all users show kare */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
