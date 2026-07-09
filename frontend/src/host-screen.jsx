import { useEffect, useState } from "preact/hooks";
import { socket } from "./lib/socket";
import { toast } from "react-toastify";

function Host({ onCancel }) {
  const [roomCode, setRoomCode] = useState("");

  socket.on("sendCode", (code) => {
    setRoomCode(code);
  });

  return (
    <div
      id="host-screen"
      className="flex h-screen w-full bg-linear-to-br  items-center justify-center"
    >
      <div className="w-175 rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-12 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white">Room Created</h1>

        <p className="text-slate-300 text-lg">
          Share this code with your friend
        </p>

        <div
          id="room-code"
          className="w-full py-6 rounded-2xl bg-slate-900 border-2 border-indigo-500 text-center text-6xl font-black tracking-[0.4em] text-indigo-400 select-all"
        >
          {roomCode}
        </div>

        <button
          id="copy-btn"
          className="px-10 py-4 rounded-xl bg-indigo-600 text-white text-xl font-semibold shadow-lg hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(roomCode);
            toast("Code copied", {
              toastId: "copyToast",
            });
          }}
        >
          📋 Copy Code
        </button>

        <div className="flex items-center gap-3 text-emerald-400 text-lg">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          Waiting for opponent...
        </div>

        <button
          id="cancel"
          className="mt-4 px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Host;
