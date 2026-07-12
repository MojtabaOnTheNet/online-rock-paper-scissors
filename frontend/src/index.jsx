import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import "./style.css";

import Home from "./home-screen";
import Host from "./host-screen";
import Join from "./join-screen";
import { socket } from "./lib/socket";
import { toast, ToastContainer } from "react-toastify";
import Username from "./username-screen";
import Game from "./game-screen";

export function App() {
  const [screen, setScreen] = useState("home");

  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isHost, setIsHost] = useState(false);
  const [gameData, setGameData] = useState({
    host: {
      name: "",
      choice: "",
      points: 0,
    },
    guest: {
      name: "",
      choice: "",
      points: 0,
    },
  });

  useEffect(() => {
    function handleGameStart(data) {
      toast(data.message);
      setGameData(data.room);
      setScreen("game");
      setIsHost(username === data.host.name);
    }
    function handleGameNextRound(data) {
      toast(data.message);
      setGameData(data.room);
    }

    socket.on("game:start", handleGameStart);
    socket.on("game:next-round", handleGameNextRound);

    return () => {
      socket.off("game:start", handleGameStart);
      socket.off("game:next-round", handleGameNextRound);
    };
  }, []);

  return (
    <>
      {username ? (
        <>
          {screen === "home" && (
            <Home
              onHost={() => {
                setScreen("host");
                socket.emit("host", username);
              }}
              onJoin={() => setScreen("join")}
            />
          )}

          {screen === "host" && (
            <Host
              onCancel={() => {
                socket.emit("cancel");
                setScreen("home");
              }}
            />
          )}

          {screen === "join" && (
            <Join onBack={() => setScreen("home")} username={username} />
          )}

          {screen === "game" && (
            <Game
              playerName={isHost ? gameData.host.name : gameData.guest.name}
              opponentName={isHost ? gameData.guest.name : gameData.host.name}
              score={isHost ? gameData.host.points : gameData.guest.points}
              opponentScore={
                isHost ? gameData.guest.points : gameData.host.points
              }
              roundText="Choose your move"
              onChoice={(choice) => socket.emit("play", choice)}
              onLeave={() => {
                socket.emit("cancel");
                setScreen("home");
              }}
            />
          )}
          <ToastContainer limit={3} pauseOnFocusLoss={false} />
          <div className="absolute top-5 left-5 text-white">
            Username: {username}
            <span
              className="underline text-blue-300 pl-3 cursor-pointer"
              onClick={() => {
                setUsername("");
              }}
            >
              change
            </span>
          </div>
        </>
      ) : (
        <Username
          onContinue={(name) => {
            setUsername(name);
            setScreen("home");
          }}
        />
      )}
    </>
  );
}

render(<App />, document.getElementById("app"));
