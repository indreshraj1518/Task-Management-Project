Task Management System (MERN Stack)
Project Overview

This is a full-stack Task Management application built with the MERN stack (MongoDB, Express.js, React, Node.js).
The application allows role-based task management, meaning different users have different permissions. It supports Admins and Normal Users:

Admin:
Can create, edit, and delete tasks
Assign tasks to specific users
Manage users (add, delete, view all users)
View all tasks including assignment details

Normal User:
Can view only tasks assigned to them
Edit their tasks (title, description, due date)
Update task status
Cannot delete tasks or manage users
The project is designed to be scalable, secure, and easy to maintain.

Key Features
1. User Authentication & Authorization
Users can register or login.
Admin users are differentiated from normal users by the role field.
JWT-based authentication ensures secure access.
Role-based access control ensures:
Normal users see only their tasks
Admins see all tasks and user management options

3. Task Management
Create Task: Admin can create tasks with title, description, due date, priority, and assigned user.
Edit Task: Admin can edit any task; normal users can edit only their assigned tasks.
Delete Task: Only admin can delete tasks.
Task Assignment: Admin can assign tasks to users by username. If username does not exist, task cannot be assigned.
Task Status: Both admins and assigned users can update the task status (Pending/Completed).
Task Priority: Low / Medium / High priorities are supported and visually distinguished in UI.

3. User Management (Admin Only)
Admin can view all registered users in a table.
Admin can promote a user to admin or delete a user.
Ensures proper control over system users and permissions.
4. Frontend

React.js with TailwindCSS for responsive UI
TaskList Page: Paginated list of tasks
TaskDetails Page: Detailed view of a task including assignment and status
TaskForm Page: Create or edit task (admin + assigned user)
UserList Page: Admin-only user management
5. Backend
Node.js + Express.js server
MongoDB + Mongoose for data persistence

Models:
User: username, email, password, role
Task: title, description, dueDate, priority, status, assignedTo

RESTful APIs for all operations:
/api/auth → Login/Register
/api/tasks → CRUD operations with RBAC
/api/users → User management for admin

6. Error Handling & Validation
API validates input and user permissions
Provides proper error messages for unauthorized access, missing fields, or non-existent users
Frontend shows alerts for failures (task fetch, edit, delete, etc.)

project-root/
│
├── backend/
│   ├── models/      # Mongoose models (User, Task)
│   ├── routes/      # Express routes (auth, tasks, users)
│   ├── middleware/  # Auth middleware
│   ├── .env         # Environment variables
│   └── server.js    # Backend entry point
│
└── frontend/TaskManagement/
    ├── src/
    │   ├── pages/      # TaskList, TaskDetails, TaskForm, UserList
    │   ├── api/        # Axios client
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
