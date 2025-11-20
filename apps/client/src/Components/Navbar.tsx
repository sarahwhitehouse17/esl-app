import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-3 bg-green-200 sticky top-0">
      <div className="flex justify-end w-full gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-green-500"
              : "text-shadow-gray-600 hover:text-green-500"
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/homepage"
          className={({ isActive }) =>
            isActive
              ? "text-green-500"
              : "text-shadow-gray-600 hover:text-green-500"
          }
        >
          Homepage
        </NavLink>
        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            isActive
              ? "text-green-500"
              : "text-shadow-gray-600 hover:text-green-500"
          }
        >
          Exercises
        </NavLink>
        <NavLink
          to="/wordle"
          className={({ isActive }) =>
            isActive
              ? "text-green-500"
              : "text-shadow-gray-600 hover:text-green-500"
          }
        >
          Wordle
        </NavLink>
      </div>
    </nav>
  );
}
