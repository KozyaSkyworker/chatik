import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  name: string;
  room: string;
  socket: Socket;
}

interface MessagesProps {
  from: string;
  room: string;
  message: string;
}

const TEXT_CONTENT = {
  submit: "send",
};

export const ChatWidget = ({ socket, name, room }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messsages, setMessages] = useState<MessagesProps[]>([]);

  const handleSendMessage = () => {
    const sendData = {
      message: newMessage.trim(),
      from: name,
      room,
    };

    socket.emit("message", sendData);
    setNewMessage("");
  };

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div className="w-1/2 max-h-[90%] min-h-[90%] flex flex-col shrink-0 bg-white rounded gap-6 overflow-hidden">
      <div className="px-6 py-2 border-b">
        <h1 className="text-xl font-bold">{room}</h1>
      </div>
      <div className="p-6 grow overflow-y-auto flex flex-col gap-4">
        {messsages.map((itm) => (
          <div
            className={`bg-teal-400 rounded  ${
              name === itm.from ? "ml-auto" : "mr-auto"
            }`}
          >
            {/* <span className=" rounded bg-red-400 px-2 py-1">{itm.from}</span> */}
            <p className="rounded px-2 py-1">{itm.message}</p>
          </div>
        ))}
      </div>
      <div className="flex p-6 gap-6 border-t">
        <textarea
          className="grow resize-none border rounded px-2 py-1 rounded"
          name="message"
          id="message"
          rows={1}
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <button
          className={`${
            newMessage.trim() ? "pointer-events-auto" : "pointer-events-none"
          } disabled:opacity-50 bg-blue-600 cursor-pointer text-white font-medium p-2 uppercase rounded hover:bg-blue-700 active:bg-blue-800`}
          type="submit"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          {TEXT_CONTENT.submit}
        </button>
      </div>
    </div>
  );
};
