const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

const adjectives = ["Swift", "Happy", "Blue", "Brave"];
const animals = ["Fox", "Bear", "Wolf", "Panda"];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
  const username =
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    animals[Math.floor(Math.random() * animals.length)];
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", `${username}: ${msg}`);
  });
  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

server.listen(8000, () => {
  console.log("Listening on port 8000...");
});
