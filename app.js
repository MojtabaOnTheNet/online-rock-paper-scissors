const express = require("express");
const { createServer } = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
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

app.use(express.static("public"));

// Initialize redis
(async () => {
  await client.connect();
  client.set(
    "room",
    JSON.stringify({
      players: {
        player1: {
          socketId: null,
          choice: null,
        },
        player2: {
          socketId: null,
          choice: null,
        },
      },
    }),
  );
  console.log("Redis connected");
})();

io.on("connection", async (socket) => {
  console.log(`${socket.id} connected`);
  const room = JSON.parse(await client.get("room"));

  // If player one already connected
  if (room.players.player1.socketId) {
    room.players.player2.socketId = socket.id;
    client.set("room", JSON.stringify(room));
  } else {
    // Else if the first player connected
    room.players.player1.socketId = socket.id;
    client.set("room", JSON.stringify(room));
  }
  console.log(room);

  socket.on("play", async (choice) => {
    const room = JSON.parse(await client.get("room"));
    if (room.players.player1.socketId === socket.id) {
      console.log("Hello from 1");
      room.players.player1.choice = choice;
    } else {
      console.log("Hello from 2");
      room.players.player2.choice = choice;
    }

    await client.set("room", JSON.stringify(room));

    console.log(room);

    // If both played
    if (room.players.player1.choice && room.players.player2.choice) {
      const winner = getWinner(room.players.player1, room.players.player2);
      console.log(winner.socketId || winner);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(8000, () => {
  console.log("Listening on port 8000...");
});
