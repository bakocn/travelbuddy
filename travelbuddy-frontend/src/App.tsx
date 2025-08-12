
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import Home from "./pages/Home"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoute from "./components/PrivateRoute"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={
  <PrivateRoute>
    <Search />
  </PrivateRoute>
} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

