const client = require("./db");
const { generateRoomCode, getWinner } = require("./utils");

exports.hostGame = async (io, socket, username) => {
  const code = generateRoomCode(6);
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
};

exports.joinGame = async (io, socket, { code, username }) => {
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
};

exports.cancelGame = async (socket) => {
  await client.del(`room:${socket.data.roomCode}`);
  console.log(`Room-${socket.data.roomCode} deleted`);
};

exports.disconnectUser = async (socket) => {
  if (socket.data.roomCode) {
    await client.del(`room:${socket.data.roomCode}`);
  }
  console.log(`${socket.id} disconnected`);
};
