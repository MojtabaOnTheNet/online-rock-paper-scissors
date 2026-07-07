# Online Rock Paper Scissors

A simple real-time **Rock Paper Scissors** game built to learn how WebSockets work in production applications. The project focuses on building a multiplayer game from scratch using **Socket.IO**, **Redis**, and **Node.js** without relying on frontend frameworks or SSR frameworks like Next.js.

---

## Goals

- Learn how real-time communication works using WebSockets.
- Understand Socket.IO's event-driven architecture.
- Manage multiplayer game sessions.
- Use Redis for temporary game state and room management.
- Perform server-side rendering with plain Node.js.
- Keep the architecture simple and educational.

---

## Tech Stack

| Technology          | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| Node.js             | Backend server and server-side rendering         |
| Socket.IO           | Real-time bidirectional communication            |
| Redis               | Game room storage, session data, and matchmaking |
| HTML/CSS/JavaScript | Client-side interface                            |
| Express             | HTTP server and routing                          |

---

## Features

### Multiplayer Rooms

- Create a new game.
- Generate a unique room code.
- Join an existing room using the room code.
- Limit each room to two players.

---

### Real-Time Gameplay

- Instant player connections.
- Live move synchronization.
- Simultaneous move reveal.
- Automatic winner calculation.
- Play multiple rounds without refreshing the page.

---

### Redis Integration

Redis will be used as temporary storage for:

- Active game rooms
- Room codes
- Connected players
- Player choices
- Match state
- Automatic room cleanup after disconnects or inactivity

Example room structure:

```json
{
  "code": "ABCD12",
  "players": [
    {
      "id": "socket-id-1",
      "name": "Alice"
    },
    {
      "id": "socket-id-2",
      "name": "Bob"
    }
  ],
  "status": "playing",
  "round": 3
}
```

---

### Server-Side Rendering

Instead of using a framework like Next.js, pages will be rendered directly by Node.js.

Benefits:

- Learn how SSR works internally.
- Full control over HTML generation.
- No frontend framework required.
- Faster understanding of the request-response lifecycle.

Example flow:

```
Browser
    │
HTTP Request
    │
Node.js
    │
Generate HTML
    │
Return HTML
    │
Browser renders page
```

Static assets such as CSS, JavaScript, and images will be served by Express.

---

## WebSocket Events

### Client → Server

| Event          | Description                     |
| -------------- | ------------------------------- |
| `create-room`  | Create a new game room          |
| `join-room`    | Join an existing room           |
| `player-ready` | Player is ready                 |
| `play-move`    | Send Rock/Paper/Scissors choice |
| `play-again`   | Start another round             |

---

### Server → Client

| Event           | Description               |
| --------------- | ------------------------- |
| `room-created`  | Room successfully created |
| `room-joined`   | Successfully joined room  |
| `player-joined` | Opponent connected        |
| `round-start`   | Begin a new round         |
| `round-result`  | Winner and choices        |
| `player-left`   | Opponent disconnected     |
| `game-ended`    | Game finished             |

---

## Project Structure

```
project/
│
├── server/
│   ├── index.js
│   ├── routes/
│   ├── sockets/
│   ├── services/
│   ├── redis/
│   ├── views/
│   └── utils/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── package.json
└── README.md
```

---

## Game Flow

```text
Player A
    │
Create Room
    │
Generate Code
    │
Store Room in Redis
    │
──────────────
Player B joins
    │
Socket.IO connects both players
    │
Start Round
    │
Players choose moves
    │
Server receives both choices
    │
Determine winner
    │
Broadcast results
    │
Play Again
```

---

## Learning Objectives

By completing this project, I'll gain experience with:

- WebSocket fundamentals
- Socket.IO events and rooms
- Multiplayer application design
- Redis data modeling
- Temporary state management
- Server-side rendering without frameworks
- Node.js HTTP lifecycle
- Express middleware
- Event-driven programming
- Client-server communication
- Disconnect handling
- Clean project architecture

---

## Possible Future Improvements

- Spectator mode
- Score tracking
- User authentication
- Persistent match history
- Matchmaking queue
- Timed rounds
- Chat system
- Emojis and reactions
- Animations
- Mobile-friendly UI
- Docker deployment
- HTTPS support
- Horizontal scaling with Redis Pub/Sub
- Automated tests
- Rate limiting
- Reconnection support

---

## Project Philosophy

This project prioritizes learning over complexity. Every major component—HTTP handling, server-side rendering, WebSocket communication, and Redis state management—is implemented directly using Node.js and its ecosystem to provide a clear understanding of how real-time web applications function under the hood.
