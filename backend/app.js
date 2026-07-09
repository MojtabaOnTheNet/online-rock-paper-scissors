const express = require("express");
const path = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const client = createClient();

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

// app.use(express.static(path.join(__dirname, "public")));

// Initialize redis
(async () => {
  await client.connect();

  console.log("Redis connected");
})();

io.on("connection", async (socket) => {
  console.log(`${socket.id} connected`);

  // When player clicks on hosting
  socket.on("host", async () => {
    const roomCode = generateRoomCode((length = 6));
    socket.join(roomCode);
    await client.set(
      `room:${roomCode}`,
      JSON.stringify({
        host: socket.id,
        guest: null,
        choice: {
          host: null,
          guest: null,
        },
      }),
    );
    io.to(roomCode).emit("sendCode", roomCode);
  });

  // When player clicks on joining
  socket.on("join", async (roomCode) => {
    const room = JSON.parse(await client.get(`room:${roomCode}`));
    room.guest = socket.id;
    await client.set(`room:${roomCode}`, JSON.stringify(room));
    console.log(room);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(8000, () => {
  console.log("Listening on port 8000...");
});
