import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { MessageBox } from "./MessageBox/MessageBox";

interface Props {
  name: string;
  room: string;
  socket: Socket;
}

type TUserStatus = "joined" | "disconnected";

interface BaseMessageUser {
  from: string;
  room: string;
  message: string;
}

interface MessageUserStatus {
  type: "notification";
  status: TUserStatus;
  name: string;
}

interface MessageUser extends BaseMessageUser {
  type: "message";
}

type MessagesProps = MessageUser | MessageUserStatus;

export const ChatWidget = ({ socket, name, room }: Props) => {
  const [messsages, setMessages] = useState<MessagesProps[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (data: BaseMessageUser) => {
      console.log(data.message);
      setMessages((prev) => [...prev, { ...data, type: "message" }]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("userStatus", (data: { message: TUserStatus; name: string }) => {
      const { message, name } = data;

      setMessages((prev) => [
        ...prev,
        { type: "notification", name, status: message },
      ]);
    });

    return () => {
      socket.off("userStatus");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("updateUserList", (users: { name: string; id: number }[]) => {
      setUsers(users.map((user) => user.name));
    });

    return () => {
      socket.off("updateUserList");
    };
  });

  return (
    <div className="w-1/2 max-h-[90%] min-h-[90%] flex flex-col shrink-0 bg-white rounded gap-6 overflow-hidden">
      <div className="px-6 py-2 border-b">
        <h1 className="text-xl font-bold">
          room: {room} - {name}
        </h1>
        <h2>users: {[...users].join(", ")}</h2>
      </div>
      <div className="p-6 grow overflow-y-auto flex flex-col gap-4">
        {messsages.map((itm) => {
          if (itm.type === "message") {
            return (
              <div
                key={JSON.stringify(itm)}
                className={`bg-teal-400 rounded  ${
                  name === itm.from ? "ml-auto" : "mr-auto"
                }`}
              >
                <span
                  className={`rounded bg-red-400 px-2 py-1 w-max block ${name === itm.from ? "ml-auto" : "mr-auto"}`}
                >
                  {itm.from}
                </span>
                {/* <p className="rounded px-2 py-1 whitespace-pre-wrap">
                  {itm.message}
                </p> */}
                <p
                  className="rounded px-2 py-1 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: itm.message }}
                />
              </div>
            );
          }

          return (
            <p className="w-max mx-auto" key={JSON.stringify(itm)}>
              {itm.name} - {itm.status}
            </p>
          );
        })}
      </div>
      <div className="flex p-6 gap-6 border-t">
        {/* <textarea
          className="grow resize-none border rounded px-2 py-1 rounded"
          name="message"
          id="message"
          rows={rows}
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSendMessage();
              e.preventDefault();
            }

            if (e.key === "Enter" && e.shiftKey) {
              setRows((r) => r + 1);
            }
          }}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        /> */}
        <MessageBox name={name} room={room} socket={socket} />
      </div>
    </div>
  );
};
