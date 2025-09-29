import { Link } from "react-router-dom";


export default function Home() {
  return (
   <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('plane2.jpg')"
      }}
    >
     
     <div className="absolute inset-0 bg-black/40" />

     
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white p-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to TravelBuddy AI</h1>
        <p className="text-lg max-w-2xl">
         <Link className="font-bold text-2xl text-blue-500" to={"/login"}> Find </Link>the cheapest flights and hotels based on your preferences.
        </p>
      </div>
    </div>
  )
}
