const express = require("express");
const path = require("path");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  joinGame,
  hostGame,
  cancelGame,
  disconnectUser,
  playGame,
} = require("./socket.controllers");

const app = express();

// Add Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  }),
);

// Start Main Server
const server = createServer(app);

// Start WebSocket Server
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Main Connection Handling
io.on("connection", async (socket) => {
  console.log(`${socket.id} connected`);

  // When player clicks on hosting
  socket.on("host", async (username) => {
    await hostGame(io, socket, username);
  });

  // When player clicks on joining
  socket.on("join", async (gameData) => {
    await joinGame(io, socket, gameData);
  });

  socket.on("play", async (choice) => {
    await playGame(io, socket, choice);
  });

  socket.on("cancel", async () => {
    await cancelGame(io, socket);
  });

  socket.on("disconnect", async () => {
    await disconnectUser(io, socket);
  });
});

// Listening on port 8000
server.listen(8000, () => {
  console.log("Listening on port 8000...");
});
