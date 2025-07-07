import { useEffect } from "react";
import { useSearchParams } from "react-router";
import io from "socket.io-client";
import { ChatWidget } from "./ChatWidget";

const socket = io("http://localhost:4444");

export const Chat = () => {
  const [searchParams] = useSearchParams();
  const [name, room] = [searchParams.get("name"), searchParams.get("room")];

  useEffect(() => {
    socket.connect();
    socket.emit("join", { name, room });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen bg-blue-300 flex items-center justify-center">
      {name && room && <ChatWidget socket={socket} name={name} room={room} />}
    </div>
  );
};
