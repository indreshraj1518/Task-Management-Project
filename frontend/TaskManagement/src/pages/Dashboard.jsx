import { useState } from "react";
import TaskForm from "../Components/TaskForm";
import TaskList from "../Components/TaskList";
import Navbar from "../Components/Navbar";

export default function Dashboard() {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <TaskForm initial={editing || {}} onSuccess={() => setEditing(null)} />
        <TaskList onEdit={setEditing} />
      </div>
    </div>
  );
}
