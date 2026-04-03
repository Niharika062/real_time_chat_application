import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/auth/users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {user?.username} 👋</h2>
        <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <h3>Users</h3>

      {users.length === 0 ? (
        <p>No other users yet.</p>
      ) : (
        <div>
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => navigate(`/chat/${u._id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  fontWeight: "bold",
                }}
              >
                {u.username[0].toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{u.username}</p>
                <p style={{ margin: 0, fontSize: "12px", color: onlineUsers.includes(u._id) ? "green" : "gray" }}>
                  {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;