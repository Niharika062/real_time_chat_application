# 💬 Real-Time Chat Application

A full-stack real-time messaging platform built with the MERN stack and Socket.io, enabling instant bidirectional communication between users.

## 🛠️ Tech Stack

**Frontend:** React.js, Socket.io-client, Axios, React Router DOM

**Backend:** Node.js, Express.js, Socket.io

**Database:** MongoDB (Mongoose)

**Cache & Presence:** Redis (ioredis)

**Auth:** JWT, bcryptjs

## ✨ Features

- 🔐 JWT-based authentication (register/login)
- 💬 Real-time 1:1 messaging using WebSockets (Socket.io)
- 🟢 Online/offline presence tracking via Redis
- 📜 Persistent message history with MongoDB
- 🔒 Protected routes with JWT middleware
- ⚡ Sub-200ms message delivery in testing
- 🧹 Automatic socket cleanup on disconnect to prevent memory leaks

## 🏗️ Architecture
```
Client (React)
    |
    | HTTP (REST API) — Auth, fetch messages
    | WebSocket (Socket.io) — Real-time messaging
    |
Server (Node.js + Express)
    |
    |— MongoDB — stores users and messages
    |— Redis — tracks online users and socket IDs
```

### How Real-Time Messaging Works

1. User logs in → frontend connects to Socket.io server with `userId` as query param
2. Server stores `socket:userId → socketId` in Redis
3. User sends a message → POST `/api/message/send/:userId`
4. Server saves message to MongoDB
5. Server looks up receiver's socket ID from Redis → `redis.get("socket:receiverId")`
6. Server emits `newMessage` event directly to receiver's socket
7. Receiver's frontend listens for `newMessage` → appends to chat instantly

## 📁 Folder Structure

```
BACKEND/
├── config/
│   └── redis.js          # Redis connection
├── controllers/
│   ├── auth.controller.js    # Register, login, get users
│   └── message.controller.js # Send, get messages, online users
├── db/
│   └── index.js          # MongoDB connection
├── middleware/
│   └── auth.middleware.js    # JWT verification
├── models/
│   ├── user.model.js         # User schema
│   └── message.model.js      # Message schema
├── routes/
│   ├── auth.routes.js
│   └── message.routes.js
├── app.js
└── index.js              # Server + Socket.io setup

FRONTEND/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance with JWT interceptor
│   ├── context/
│   │   ├── AuthContext.jsx   # Auth state management
│   │   └── SocketContext.jsx # Socket.io connection management
│   ├── pages/
│   │   ├── Home.jsx          # User list with online status
│   │   ├── Chat.jsx          # Chat interface
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── App.jsx
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Redis (local or cloud)

### Backend Setup

```bash
cd BACKEND
npm install
```

Create `.env` file:
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=9000
BASE_URL=http://localhost:9000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd FRONTEND
npm install
npm run dev
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/users` | Get all users | Yes |

### Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/message/:userId` | Get conversation history | Yes |
| POST | `/api/message/send/:userId` | Send a message | Yes |
| GET | `/api/message/online-users` | Get online user IDs | Yes |

---

## 🔐 Authentication Flow

1. User registers → password hashed with bcrypt (10 salt rounds)
2. User logs in → JWT token generated (7 day expiry)
3. Token stored in localStorage
4. Every request attaches token via Axios interceptor: `Authorization: Bearer <token>`
5. Backend middleware verifies token and attaches user to `req.user`

   ![Untitled](https://github.com/user-attachments/assets/e87dd792-273d-43aa-92d7-d7ba69498868)

   ![Untitled](https://github.com/user-attachments/assets/035475a4-df8e-49c6-8f64-0e66ab6fb060)


