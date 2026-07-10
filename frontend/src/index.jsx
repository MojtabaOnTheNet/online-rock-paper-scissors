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
  const [gameData, setGameData] = useState({
    host: "",
    guest: "",
  });

  useEffect(() => {
    function handleGameStart(data) {
      toast(data.message);
      setGameData({
        ...gameData,
        host: data.host,
        guest: data.guest,
      });
      setScreen("game");
    }

    socket.on("game:start", handleGameStart);

    return () => {
      socket.off("game:start", handleGameStart);
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
              playerName={
                username === gameData.host ? gameData.host : gameData.guest
              }
              opponentName={
                username === gameData.host ? gameData.guest : gameData.host
              }
              score={2}
              opponentScore={1}
              roundText="Choose your move"
              onChoice={(choice) => socket.emit("play", choice)}
              onLeave={() => setScreen("home")}
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
