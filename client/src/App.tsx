import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  // const socket = io("http://localhost:3000");
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [socketID, setSocketID] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([]);

  console.log(messages)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Cilcked on submit");
    socket.emit("message", {message, room});
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id || "")
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data])
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  return (
    <div className="h-screen w-screen items-center justify-center flex flex-col gap-2">
      <h1>{socketID}</h1>
      <div className="flex gap-4">
        <input
          type="text"
          id="input-field"
          placeholder="Enter the message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSubmit(e);
          }}
          className="border-2 border-black rounded-md pl-2 "
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out"
        >
          Send
        </button>
      </div>
      <input
        type="text"
        id="input-field"
        placeholder="Enter the room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="border-2 border-black rounded-md pl-2 p-2 self-center"
      />
    </div>
  );
}

export default App;
