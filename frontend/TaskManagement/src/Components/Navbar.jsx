// src/Components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // go to home on logout
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-300">
          Home
        </Link>

        {/* show Tasks link to any logged in user */}
        {user && (
          <Link to="/tasks" className="hover:text-yellow-300">
            Tasks
          </Link>
        )}

        {/* admin-only links */}
        {user?.role === "admin" && (
          <>
            <Link to="/dashboard" className="hover:text-yellow-300">
              Dashboard
            </Link>
            <Link to="/users" className="hover:text-yellow-300">
              User List
            </Link>
          </>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span className="mr-2">Hi, {user.username || user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
