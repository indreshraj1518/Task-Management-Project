import Navbar from "./Navbar";

export default function Home({ user }) {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Our Task Management Platform{" "}
          {/* {user ? user.username : "Guest"} 👋 */}
        </h1>
        <img
          src="https://snacknation.com/wp-content/uploads/2020/12/Best-Task-Management-Software-Platforms.png"
          alt="Welcome"
          className="rounded shadow-lg"
        />
      </div>
    </div>
  );
}
