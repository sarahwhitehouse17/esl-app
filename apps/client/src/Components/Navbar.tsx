import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-3 bg-green-200">
      <div className="flex justify-end w-full gap-6">
        <Link to="/" className="hover:text-green-500">
          Login
        </Link>
        <Link to="/homepage" className="hover:text-green-500">
          Homepage
        </Link>{" "}
        <Link to="/exercises" className="hover:text-green-500">
          Exercises
        </Link>
        <Link to="/wordle" className="hover:text-green-500">
          Wordle
        </Link>
      </div>
    </nav>
  );
}
