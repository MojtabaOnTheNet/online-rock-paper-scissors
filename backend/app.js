const express = require("express");
const path = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { createClient, SocketClosedUnexpectedlyError } = require("redis");
const { Server } = require("socket.io");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  }),
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const client = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

function getWinner(player1, player2) {
  // Draw
  if (player1.choice === player2.choice) {
    return "draw";
  }

  // Player 1 wins
  if (
    (player1.choice === "rock" && player2.choice === "scissors") ||
    (player1.choice === "paper" && player2.choice === "rock") ||
    (player1.choice === "scissors" && player2.choice === "paper")
  ) {
    return player1;
  }

  // Otherwise player 2 wins
  return player2;
}

function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

// Initialize redis
(async () => {
  await client.connect();

  console.log("Redis connected");
})();

io.on("connection", async (socket) => {
  console.log(`${socket.id} connected`);

  // When player clicks on hosting
  socket.on("host", async (username) => {
    const code = generateRoomCode((length = 6));
    socket.join(code);
    socket.data.roomCode = code;
    await client.set(
      `room:${code}`,
      JSON.stringify({
        host: username,
        guest: null,
        choices: {
          host: null,
          guest: null,
        },
      }),
    );
    io.to(code).emit("sendCode", code);
  });

  // When player clicks on joining
  socket.on("join", async ({ code, username }) => {
    const room = JSON.parse(await client.get(`room:${code}`));
    if (!room) {
      return socket.emit("error:no-room", "Room doesn't exist");
    }
    if (room.guest) {
      return socket.emit("error:room-full", "Room already full");
    }
    socket.join(code);
    room.guest = username;
    await client.set(`room:${code}`, JSON.stringify(room));
    io.to(code).emit("game:start", {
      message: "Game Started!",
      host: room.host,
      guest: room.guest,
    });
    console.log(room);
  });

  socket.on("cancel", async () => {
    await client.del(`room:${socket.data.roomCode}`);
    console.log(`Room-${socket.data.roomCode} deleted`);
  });

  socket.on("disconnect", async () => {
    await client.del(`room:${socket.data.roomCode}`);
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(8000, () => {
  console.log("Listening on port 8000...");
});
