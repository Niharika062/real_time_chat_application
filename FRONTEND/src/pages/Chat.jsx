import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMessages();
    fetchReceiver();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/api/message/${userId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiver = async () => {
    try {
      const res = await API.get("/api/auth/users");
      const found = res.data.users.find((u) => u._id === userId);
      setReceiver(found);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const res = await API.post(`/api/message/send/${userId}`, { message });
      setMessages((prev) => [...prev, res.data.message]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "15px", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => navigate("/")} style={{ cursor: "pointer" }}>←</button>
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {receiver?.username[0].toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }}>{receiver?.username}</p>
          <p style={{ margin: 0, fontSize: "12px", color: onlineUsers.includes(userId) ? "green" : "gray" }}>
            {onlineUsers.includes(userId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: msg.senderId === user.id ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 15px",
                  borderRadius: "18px",
                  background: msg.senderId === user.id ? "#007bff" : "#f0f0f0",
                  color: msg.senderId === user.id ? "white" : "black",
                }}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{ padding: "15px", borderTop: "1px solid #ccc", display: "flex", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", borderRadius: "20px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;