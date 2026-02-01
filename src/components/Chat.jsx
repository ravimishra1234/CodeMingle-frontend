import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const bottomRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
      };
    });

    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto m-5 h-[70vh] flex flex-col 
      bg-neutral/80 backdrop-blur 
      border border-white/10 
      rounded-2xl shadow-xl"
    >
      <h1 className="p-5 border-b border-white/10 text-lg font-semibold tracking-wide">
        Chat
      </h1>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 scroll-smooth">
        {messages.map((msg, index) => {
          const isMe = user.firstName === msg.firstName;

          return (
            <div
              key={index}
              className={"chat " + (isMe ? "chat-end" : "chat-start")}
            >
              <div className="chat-header opacity-70 text-sm">
                {`${msg.firstName} ${msg.lastName}`}
                <time className="text-xs ml-2">2 hours ago</time>
              </div>

              <div
                className={
                  "chat-bubble shadow " +
                  (isMe
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content")
                }
              >
                {msg.text}
              </div>

              <div className="chat-footer opacity-50 text-xs">Seen</div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-neutral/60">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-base-100/60 border border-white/10 
          text-white rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={sendMessage}
          className="btn btn-primary rounded-xl px-6"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
