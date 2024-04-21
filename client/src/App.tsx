import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [socketID, setSocketID] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('join-room', roomName);
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id || "");
    });

    socket.on("receive-message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  return (
    <div className="h-screen w-screen items-center justify-center flex flex-col gap-2">
      <h1>{socketID}</h1>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <input
          type="text"
          id="input-field"
          placeholder="Enter the message"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="border-2 border-black rounded-md pl-2
          p-2 "
        />
        <button
          type="submit"
          className="bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out"
        >
          Join
        </button>
      </form>
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
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
