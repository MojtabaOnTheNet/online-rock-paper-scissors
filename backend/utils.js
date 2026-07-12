exports.getWinner = (player1, player2) => {
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
};

exports.generateRoomCode = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};

exports.resetPlayersStates = async (choice = false, points = false, room) => {
  if (choice) {
    if (points) {
      room.host.points = 0;
      room.guest.points = 0;
    }
    room.host.choice = null;
    room.guest.choice = null;
  }
};
