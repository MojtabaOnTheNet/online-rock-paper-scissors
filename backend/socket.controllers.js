const client = require("./db");
const { generateRoomCode, getWinner, resetPlayersStates } = require("./utils");

exports.hostGame = async (io, socket, username) => {
  console.log(`[hostGame] "host" event received from socket ${socket.id} with username: ${username}`);
  try {
    const code = generateRoomCode(6);
    console.log(`[hostGame] generated room code: ${code}`);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.role = "host";
    await client.set(
      `room:${code}`,
      JSON.stringify({
        host: {
          name: username,
          choice: null,
          points: 0,
        },
        guest: {
          name: null,
          choice: null,
          points: 0,
        },
      }),
    );
    console.log(`[hostGame] room:${code} persisted to Redis, socket.data.roomCode set to ${socket.data.roomCode}`);
    io.to(code).emit("sendCode", code);
  } catch (err) {
    console.error(`[hostGame] error while hosting game for socket ${socket.id}:`, err);
    socket.emit("error:redis", "Failed to create room, please try again");
  }
};

exports.joinGame = async (io, socket, { code, username }) => {
  console.log(`[joinGame] "join" event received from socket ${socket.id} - requested code: ${code}, username: ${username}`);
  try {
    const raw = await client.get(`room:${code}`);
    console.log(`[joinGame] Redis returned for room:${code}:`, raw);
    const room = JSON.parse(raw);
    if (!room) {
      console.log(`[joinGame] room:${code} not found in Redis`);
      return socket.emit("error:no-room", "Room doesn't exist");
    }
    if (room.guest.name) {
      console.log(`[joinGame] room:${code} is already full`);
      return socket.emit("error:room-full", "Room already full");
    }
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.role = "guest";
    room.guest.name = username;
    await client.set(`room:${code}`, JSON.stringify(room));
    console.log(`[joinGame] room:${code} updated in Redis, socket.data.roomCode set to ${socket.data.roomCode}`);
    io.to(code).emit("game:start", {
      message: "Game Started!",
      room,
    });
    console.log(room);
  } catch (err) {
    console.error(`[joinGame] error while joining room ${code} for socket ${socket.id}:`, err);
    socket.emit("error:redis", "Failed to join room, please try again");
  }
};

exports.playGame = async (io, socket, choice) => {
  // Get room code from socket data
  const code = socket.data.roomCode;
  let room = JSON.parse(await client.get(`room:${code}`));
  let tempChoices = {};
  let message = "";
  if (socket.data.role === "host") {
    room.host.choice = choice;
  } else if (socket.data.role === "guest") {
    room.guest.choice = choice;
  }
  if (room.host.choice && room.guest.choice) {
    const winner = getWinner(room.host, room.guest);
    tempChoices = {
      host: room.host.choice,
      guest: room.guest.choice,
    };
    if (winner !== "draw") {
      winner.points += 1;
      if (winner.points === 5) {
        resetPlayersStates(true, true, room);
        message = `${winner.name} won the entire game!`;
      } else {
        resetPlayersStates(true, false, room);
        message = `${winner.name} won! next round starts...`;
      }
    } else {
      resetPlayersStates(true, false, room);
      message = `The game was a draw! next round starts...`;
    }
    await client.set(`room:${code}`, JSON.stringify(room));
    io.to(code).emit("game:next-round", {
      message,
      room,
      tempChoices,
    });
  } else {
    await client.set(`room:${code}`, JSON.stringify(room));
  }
};

exports.cancelGame = async (io, socket) => {
  await client.del(`room:${socket.data.roomCode}`);
  io.to(socket.data.roomCode).emit("game:cancel", {
    message: "Game canceled!",
  });
  socket.leave(socket.data.roomCode);
  console.log(`Room-${socket.data.roomCode} deleted`);
};

exports.disconnectUser = async (io, socket) => {
  if (socket.data.roomCode) {
    await client.del(`room:${socket.data.roomCode}`);
    io.to(socket.data.roomCode).emit("game:cancel", {
      message: "Game canceled!",
    });
    socket.leave(socket.data.roomCode);
  }
  console.log(`${socket.id} disconnected`);
};
