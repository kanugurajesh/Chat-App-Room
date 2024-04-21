import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // React Hooks
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [socketID, setSocketID] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const randomColorGenerator = () => {
    /*
      The below code generated colors of all types
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return "#" + randomColor;
    */
    /*
      The below code generates only blue related colors
      const blueComponent = Math.floor(Math.random() * 256).toString(16).padStart(2, '0'); // Generate random blue component
      return `#0000${blueComponent}`;
    */

    // The below code generated both blue and yellow related colors

    const isBlue = Math.random() < 0.5; // Determine if it's blue or yellow color

    const blueComponent = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"); // Generates random blue component

    const yellowComponent = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"); // Generates random yellow component

    const color = isBlue
      ? `#0000${blueComponent}`
      : `#${yellowComponent}${yellowComponent}00`; // Concatenating blue or yellow components

    return color;
  };

  // The below function copies the socketID to the clipboard
  const copyToClipboard = () => {
    toast.dismiss();
    if (socketID == "") {
      toast.error("socketID is empty");
      return;
    }
    toast.success("socketID copied to clipboard");
    return navigator.clipboard.writeText(socketID);
  };

  // The below function fires a instruction notfication when user hovers over socketID in profile
  const mouseEnter = () => {
    toast("Click to copy socketID to clipboard", {
      duration: 2000,
    });
  };

  // The below function sends the message to the server which is ultimately goes the required user in the socket network
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

  // The below function adds the current user to a room channel
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

  // The below useeffect function helps to establish the socket connection
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-lg text-blue-700">My SocketID</h1>
            <button
              className="font-bold text-lg bg-blue-700 p-3 text-white rounded-md border-2 border-blue-700 hover:bg-white hover:text-blue-700 transition-all duration-300 ease-in-out cursor-pointer px-7"
              onClick={copyToClipboard}
              onMouseEnter={() => mouseEnter()}
              onMouseLeave={() => toast.dismiss()}
            >
              {socketID}
            </button>
          </div>
          <form
            onSubmit={joinRoomHandler}
            className="flex items-center flex-col gap-2"
          >
            <h1 className="font-bold text-lg text-blue-700">Join Room</h1>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-field"
                placeholder="Enter the roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border-2 border-black rounded-md pl-2 p-2"
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
        <div className="w-[100vw] flex flex-col items-center">
          <ul
            className={`z-0 mt-[60px] flex flex-col gap-2 px-3 w-[98vw] ${
              showProfile ? "" : "h-[78vh]"
            }`}
          >
            {messages.map((m, i) => (
              <li
                key={i}
                className={`font-bold p-2 rounded-md ${
                  i % 2 == 0 ? "self-start" : "self-end"
                }`}
                style={{
                  backgroundColor: randomColorGenerator(),
                  color: "white",
                }}
              >
                {m}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="flex gap-2">
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
              className="border-2 border-black rounded-md p-2"
            />
            <button
              type="submit"
              className="bg-blue-700 text-white font-bold p-2 px-3 rounded-md border-2 border-blue-700 hover:text-blue-700 hover:bg-white transition-all duration-300 ease-in-out"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
