import React, { useEffect, useState } from "react";
import { socket } from "../server/socket";
import { useParams, Link } from "react-router-dom";
export default function ChatRoom() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isType, setIsType] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    socket.emit("joinRoom", userId);
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("typing", (data) => {
      setIsType(data?.isTyping);
    });
    socket.on("stopTyping", (data) => {
      setIsType(data?.isTyping);
    });
    socket.on("previousMessages", (msg) => {
      setRoomId(msg.roomId);
      setMessages((prev) => [...prev, ...msg.messages]);
    });
    return () => {
      socket.off("previousMessages");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("message", { roomId, text: input, receiverId: userId });
    setMessages((prev) => [
      ...prev,
      { roomId, sender: user?._id, text: input, receiver: userId },
    ]);
    setInput("");
  };
  let typingTimeout;
  const handleTyping = (e) => {
    if (e.key.length > 1) return; // ignore non-character keys
    socket.emit("typing", { roomId, isTyping: true });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId, isTyping: false });
    }, 1500);
  };

  return (
    <div className="chat-room">
      <h2>Chat</h2>
      <Link to={"/users"}>Back to List</Link>
      <div className="messages">
        {messages?.length > 0 &&
          messages.map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.receiver === userId ? "right" : "left",
                color: m.receiver === userId ? "blue" : "green",
                margin: "5px 0",
              }}
            >
              {m.text}
            </div>
          ))}
      </div>
      <div className="input">
        {isType && <p className="typing-indicator">User is typing...</p>}
        <input
          value={input}
          onKeyDown={handleTyping}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
