import { createRef } from "preact";
import { socket } from "./lib/socket";

function Join({ onBack }) {
  const ref = createRef();

  return (
    <div
      id="join-screen"
      className="flex h-screen w-full bg-linear-to-br items-center justify-center"
    >
      <div className="w-175 rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-12 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white">Join a Room</h1>

        <p className="text-slate-300 text-lg">
          Enter the room code your friend shared with you.
        </p>

        <input
          ref={ref}
          id="room-input"
          type="text"
          // @ts-ignore
          maxLength="6"
          placeholder="ABC123"
          autocomplete="off"
          spellCheck="false"
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-2xl py-5 px-6 text-center text-5xl font-black tracking-[0.4em] uppercase text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition"
        />

        <button
          id="join-room-btn"
          className="w-full py-4 rounded-2xl bg-violet-600 text-white text-2xl font-semibold shadow-lg hover:bg-violet-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          onClick={() => socket.emit("join", ref.current.value)}
        >
          🚀 Join Room
        </button>

        <p id="join-error" className="hidden text-red-400 text-lg font-medium">
          Invalid room code.
        </p>

        <button
          id="back"
          className="mt-2 px-8 py-3 rounded-xl bg-slate-700 text-slate-200 font-semibold hover:bg-slate-600 transition cursor-pointer"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default Join;
