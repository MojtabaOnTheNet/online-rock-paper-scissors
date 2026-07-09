import { render } from "preact";
import { useState } from "preact/hooks";
import "./style.css";

import Home from "./home-screen";
import Host from "./host-screen";
import Join from "./join-screen";
import { socket } from "./lib/socket";
import { ToastContainer } from "react-toastify";

export function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home" && (
        <Home
          onHost={() => {
            setScreen("host");
            socket.emit("host");
          }}
          onJoin={() => setScreen("join")}
        />
      )}

      {screen === "host" && <Host onCancel={() => setScreen("home")} />}

      {screen === "join" && <Join onBack={() => setScreen("home")} />}
      <ToastContainer />
    </>
  );
}

render(<App />, document.getElementById("app"));
