import { useState } from "react";
import { MessageButton } from "./MessageButton";
import { MessageField } from "./MessageField";
import { Socket } from "socket.io-client";

interface Props {
  name: string;
  room: string;
  socket: Socket;
}

export const MessageBox = ({ name, room, socket }: Props) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    const message = newMessage.trim();
    console.log("send message:", message, "-", newMessage);
    const sendData = {
      message,
      from: name,
      room,
    };

    socket.emit("message", sendData);
    setNewMessage("");
  };

  return (
    <>
      <MessageField setNewMessage={setNewMessage} />
      <MessageButton
        disabled={!newMessage.trim()}
        onClick={handleSendMessage}
      />
    </>
  );
};
