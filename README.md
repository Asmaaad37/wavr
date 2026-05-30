# Wavr

A real-time messaging application built with a full-stack MERN architecture, Firebase Authentication, and Socket.io for live communication. Features a premium dark/light UI with instant messaging, online presence, emoji support, and avatar customization.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Features

- **Authentication** — Email/password registration and login via Firebase Auth
- **Avatar picker** — 9 randomly generated avatars (avataaars, bottts, pixel-art) via DiceBear API v9
- **Real-time messaging** — Instant message delivery via Socket.io (no page refresh needed)
- **Online presence** — Live online/offline status indicators for all users
- **Message persistence** — Full chat history stored in MongoDB, loaded on room open
- **Emoji picker** — Integrated emoji selector in the chat input
- **Search** — Search users and existing conversations
- **Dark / Light mode** — Toggle between themes, preference persisted in localStorage
- **Responsive layout** — Sidebar + chat panel layout, works on desktop browsers

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 18 | UI rendering and component state |
| TailwindCSS | 3 | Utility-first styling, dark/light mode |
| React Router DOM | 6 | Client-side routing |
| Socket.io Client | 4 | Real-time WebSocket connection |
| Axios | 0.27 | HTTP requests to the backend API |
| Firebase JS SDK | 9 | Client-side auth (register, login, logout) |
| emoji-picker-react | 3 | Emoji selector component |
| timeago.js | 4 | Human-readable message timestamps |
| @heroicons/react | 1 | Icon library |
| @headlessui/react | 1 | Accessible modal components |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 4 | REST API server |
| Socket.io | 4 | Real-time event handling and user presence |
| Mongoose | 6 | MongoDB ODM and schema definitions |
| Firebase Admin SDK | 11 | Server-side JWT token verification |
| dotenv | 16 | Environment variable loading |
| cors | 2 | Cross-origin request handling |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB | Persistent storage for chat rooms and messages |
| Firebase Authentication | User identity, token issuance |

---

## Architecture

### Authentication Flow
```
User registers/logs in (Firebase client SDK)
  → Firebase issues an ID token (JWT)
  → Token sent in Authorization header on every API request
  → VerifyToken middleware (Firebase Admin SDK) validates it
  → Socket.io handshake also carries the token (VerifySocketToken)
```

### Real-time Messaging Flow
```
Sender types message → emits "sendMessage" via Socket.io
  → Server looks up receiver's socket ID in the onlineUsers Map
  → Emits "getMessage" directly to receiver's socket
  → Message simultaneously saved to MongoDB via REST API
  → Receiver sees message instantly without polling
```

### Data Models

**ChatRoom**
```
members: [uid, uid]   // Firebase UIDs of the two participants
createdAt / updatedAt
```

**ChatMessage**
```
chatRoomId: ObjectId  // reference to ChatRoom
sender: uid           // Firebase UID of sender
message: String
createdAt / updatedAt
```

> Users are not stored in MongoDB. All user data (uid, displayName, photoURL, email) is managed by Firebase and retrieved via the Firebase Admin SDK on demand.

---

## Project Structure

```
Wavr/
├── server/
│   ├── config/
│   │   ├── firebase-config.js     # Firebase Admin SDK init (env var or local JSON)
│   │   └── mongo.js               # Mongoose connection with reconnect handling
│   ├── controllers/               # Business logic for users, rooms, messages
│   ├── middlewares/
│   │   └── VerifyToken.js         # JWT verification for HTTP and Socket.io
│   ├── models/
│   │   ├── ChatRoom.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   ├── user.js
│   │   ├── chatRoom.js
│   │   └── chatMessage.js
│   └── index.js                   # Express + Socket.io server entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── accounts/          # Login, Register, Profile, Logout
│       │   ├── chat/              # ChatRoom, Message, ChatForm, AllUsers, Contact, SearchUsers, Welcome
│       │   └── layouts/           # Header, ChatLayout, UserLayout, ThemeToggler, ErrorMessage
│       ├── contexts/
│       │   └── AuthContext.js     # Global auth state via React Context
│       ├── services/
│       │   └── ChatService.js     # All API calls (Axios) and Socket.io connection
│       ├── config/
│       │   └── firebase.js        # Firebase client SDK init
│       └── utils/
│           ├── GenerateAvatar.js  # DiceBear API v9 avatar URL generator
│           └── WithPrivateRoute.js
├── .env.example                   # Server environment variable template
├── package.json                   # Server dependencies and npm scripts
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **Firebase project** with Email/Password authentication enabled
- **nodemon** installed globally for local development: `npm install -g nodemon`

---

## Local Setup

### 1. Clone and install dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/wavr.git
cd wavr

# Install server dependencies (run from root)
npm install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → create or select a project
2. Enable **Email/Password** sign-in: Authentication → Sign-in method → Email/Password → Enable
3. Generate a service account key: Project Settings → Service Accounts → **Generate new private key**
4. Save the downloaded file as `server/config/serviceAccountKey.json`

### 3. Configure environment variables

**Server** — create `.env` in the root directory:
```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/chat_app
CLIENT_URL=http://localhost:3000
```

**Frontend** — create `.env` in the `frontend/` directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

All values are found in Firebase Console → Project Settings → General → Your apps → SDK setup.

### 4. Start MongoDB

```powershell
# Windows — verify the service is running
Get-Service -Name MongoDB

# Start it if stopped
Start-Service -Name MongoDB
```

### 5. Run the application

Open **two terminals**:

```bash
# Terminal 1 — backend (from root, with auto-restart)
npm run dev
# Expected: "Server listening on port 8080" + "Mongo has connected successfully"

# Terminal 2 — frontend (from frontend/)
npm start
# Expected: "Compiled successfully!"
```

Open **http://localhost:3000**

---

## Available Scripts

### Backend (run from root `Wavr/`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon server/index.js` | Start server locally with auto-restart on file changes |
| `npm start` | `node server/index.js` | Start server for production (no auto-restart) |

> `npm run dev` is for local development only. `npm start` is what production hosts (e.g. Render) use — it runs `node` directly without nodemon, which is not available on remote servers unless explicitly installed.

### Frontend (run from `Wavr/frontend/`)

| Script | Command | Description |
|---|---|---|
| `npm start` | `react-scripts start` | Start React dev server with hot reloading |
| `npm run build` | `react-scripts build` | Build optimised production bundle to `build/` |
| `npm test` | `react-scripts test` | Run tests with Jest + React Testing Library |

---

## Environment Variables

### Server

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `8080`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `CLIENT_URL` | Yes | Frontend URL for Socket.io CORS |
| `FIREBASE_SERVICE_ACCOUNT` | Production only | Full `serviceAccountKey.json` content as a JSON string |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `REACT_APP_BACKEND_URL` | Production only | Deployed backend URL (e.g. `https://wavr-backend.onrender.com`) |

---

## API Reference

All endpoints require a valid Firebase ID token:
```
Authorization: Bearer <firebase_id_token>
```

### Users — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Fetch all users (max 10) |
| `GET` | `/:userId` | Fetch a single user by Firebase UID |

### Chat Rooms — `/api/room`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new chat room between two users |
| `GET` | `/:userId` | Get all chat rooms for a user |
| `GET` | `/:firstUserId/:secondUserId` | Get room between two specific users |

### Messages — `/api/message`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:roomId` | Fetch all messages in a chat room |
| `POST` | `/` | Save a new message |

### Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `addUser` | Client → Server | `userId` | Register user as online |
| `getUsers` | Server → Client | `[[userId, socketId], ...]` | Broadcast online users list |
| `sendMessage` | Client → Server | `{ senderId, receiverId, message }` | Send a message |
| `getMessage` | Server → Client | `{ senderId, message }` | Receive a message |

---

## Deployment

Wavr can be deployed entirely on free tiers using:

| Layer | Service |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) (M0 free cluster) |

### Key steps

1. **MongoDB Atlas** — create a free M0 cluster, whitelist all IPs (`0.0.0.0/0`), get the connection string
2. **Render** — deploy from GitHub, set root directory to `Wavr/`, build command `npm install`, start command `npm start` (runs `node server/index.js` directly — nodemon is not used in production), add all server env vars including `FIREBASE_SERVICE_ACCOUNT`
3. **Vercel** — deploy from GitHub, set root directory to `Wavr/frontend`, add all `REACT_APP_*` env vars plus `REACT_APP_BACKEND_URL` pointing to your Render URL
4. **Firebase Console** — add your Vercel domain to Authentication → Settings → Authorized domains
5. **Render** — update `CLIENT_URL` to your Vercel URL and redeploy

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after a period of no traffic will take ~30 seconds (cold start). This is a trade-off of the free tier.

---

## Known Limitations

- **Local only by default** — without deployment, only the machine running the server can use the app
- **No media sharing** — text and emoji messages only; no image or file uploads
- **One-on-one only** — no group chat support; rooms are strictly between two users
- **Max 10 users listed** — the `/api/user` endpoint returns a maximum of 10 users
- **Render cold starts** — deployed backend on the free tier takes ~30s to wake after inactivity