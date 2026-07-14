import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import "./style.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import Home from "./home-screen";
import Host from "./host-screen";
import Join from "./join-screen";
import { socket } from "./lib/socket";
import { toast, ToastContainer } from "react-toastify";
import Username from "./username-screen";
import Game from "./game-screen";
import Background from "./background";

export function App() {
  const resultToast = useRef(null);
  const [screen, setScreen] = useState("home");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isHost, setIsHost] = useState(false);
  const [tempChoices, setTempChoices] = useState({
    host: "",
    guest: "",
  });
  const [nextRound, setNextRound] = useState(0);
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
      toast.success(data.message);
      setGameData(data.room);
      setScreen("game");
      setIsHost(username === data.room.host.name);
    }
    function handleGameNextRound(data) {
      toast.update(resultToast.current, {
        render: "Answers submitted...",
        type: "info",
        autoClose: false,
      });
      setTimeout(() => {
        toast.update(resultToast.current, {
          render: data.message,
          type: "success",
          autoClose: 3000,
        });
        setTempChoices(data.tempChoices);
        setTimeout(() => {
          setTempChoices({
            host: "",
            guest: "",
          });
          setGameData(data.room);
          setNextRound((prev) => prev + 1);
        }, 3000);
      }, 2000);
    }
    function handleCancelGame(data) {
      setScreen("home");
      toast.error(data.message);
      setGameData({
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
      setTempChoices({
        host: "",
        guest: "",
      });
      setNextRound(0);
    }

    socket.on("game:start", handleGameStart);
    socket.on("game:next-round", handleGameNextRound);
    socket.on("game:cancel", handleCancelGame);

    return () => {
      socket.off("game:start", handleGameStart);
      socket.off("game:next-round", handleGameNextRound);
      socket.off("game:cancel", handleCancelGame);
    };
  }, []);

  return (
    <>
      <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden font-finger-paint">
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
                onChoice={(choice) => {
                  socket.emit("play", choice);
                  resultToast.current = toast.info(
                    "Waiting for other player...",
                    {
                      autoClose: false,
                    },
                  );
                }}
                onLeave={() => {
                  socket.emit("cancel");
                  setScreen("home");
                }}
                nextRound={nextRound}
                tempChoices={isHost ? tempChoices.guest : tempChoices.host}
              />
            )}
            <ToastContainer
              limit={1}
              pauseOnFocusLoss={false}
              pauseOnHover={false}
              position="top-center"
              theme="dark"
              autoClose={1000}
              hideProgressBar
              newestOnTop
              transition={Zoom}
              closeButton={false}
            />
            <div className="absolute top-5 left-5 text-white">
              Username: {username}
              {screen === "game" ? null : (
                <span
                  className="underline text-blue-300 pl-3 cursor-pointer"
                  onClick={() => {
                    setUsername("");
                  }}
                >
                  change
                </span>
              )}
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
        <Background />
      </div>
    </>
  );
}

render(<App />, document.getElementById("app"));
