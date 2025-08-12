import { useState } from "react";
import { Button } from "../components/ui/button";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      setMessage("Thank you, you are registered! You can login now.");

      // Sačekaj 2 sekunde, pa preusmeri na login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {message ? (
        <p className="text-green-600 text-center mb-4">{message}</p>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border rounded p-2"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border rounded p-2"
            required
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="border rounded p-2"
            required
          />
          <Button type="submit">Register</Button>
        </form>
      )}
    </div>
  );
}
