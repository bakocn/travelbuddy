import { useState } from "react";
import { Button } from "../components/ui/button";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string; user: { id: number; name: string; email: string } }>("/auth/login", { email, password });
      // dekonstruiši
      const { token, user } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/search");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>


        <p className="mt-4 text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></p>
      </form>
    </div>
  );
}
