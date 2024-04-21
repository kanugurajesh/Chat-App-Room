import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [socketID, setSocketID] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const copyToClipboard = () => {
    toast.dismiss();
    if (socketID == "") {
      toast.error("socketID is empty");
      return;
    }
    toast.success("socketID copied to clipboard");
    return navigator.clipboard.writeText(socketID);
  };

  const mouseEnter = () => {
    toast("Click to copy socketID to clipboard", {
      duration: 2000,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!message) {
      toast.error("please write a message");
      return;
    }
    if (!room) {
      toast.error("please enter room");
      return;
    }
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomName == "") {
      toast.error("please enter a roomName");
      return;
    }
    socket.emit("join-room", roomName);
    toast.success(`You successfully joined ${roomName} room`);
    setRoomName("");
  };

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
    <div className="h-screen w-screen items-center justify-center flex flex-col gap-2 relative">
      <Toaster />
      <ul className="z-0">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      {showProfile ? (
        <button
          className="absolute top-5 right-5 bg-red-700 text-white font-bold p-2 px-3 rounded-md border-2 border-red-700 hover:text-red-700 hover:bg-white transition-all duration-300 ease-in-out"
          onClick={() => setShowProfile(!showProfile)}
        >
          X
        </button>
      ) : (
        <button
          className="absolute top-5 right-5 bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out"
          onClick={() => setShowProfile(!showProfile)}
        >
          Profile
        </button>
      )}

      {showProfile ? (
        <div>
          <h1
            className="font-bold text-lg bg-black p-3 text-white rounded-md border-2 border-black hover:bg-white hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
            onClick={copyToClipboard}
            onMouseEnter={() => mouseEnter()}
            onMouseLeave={() => toast.dismiss()}
          >
            {socketID}
          </h1>
          <form
            onSubmit={joinRoomHandler}
            className="flex items-center flex-col gap-2"
          >
            <h5 className="font-bold text-lg">Join Room</h5>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-field"
                placeholder="Enter the roomName"
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
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 z-0">
          <input
            type="text"
            id="input-field"
            placeholder="Enter the message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSubmit(e);
            }}
            className="border-2 border-black rounded-md p-2"
          />
          <input
            type="text"
            id="input-field"
            placeholder="Enter the room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border-2 border-black rounded-md pl-2 p-2 self-center"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
