import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-sm bg-white border-b">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TravelBuddy AI
      </Link>
      <div className="flex space-x-3 items-center">
        <Link to="/search">
          <Button variant="outline">Search</Button>
        </Link>

        {user ? (
          <>
            <span className="text-sm mr-2">Hi, {user.name}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost">Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
