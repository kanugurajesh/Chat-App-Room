import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3000");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Cilcked on submit");
    socket.emit("message", message);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter the message"
          name=""
          id=""
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 border-black rounded-md pl-2 "
        />
        <button onClick={handleSubmit} className="bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out">Submit</button>
      </div>
    </div>
  );
}

export default App;
