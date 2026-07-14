import { createRef } from "preact";
import { socket } from "./lib/socket";
import { toast } from "react-toastify";
import { useEffect } from "preact/hooks";

function Join({ onBack, username }) {
  const ref = createRef();

  useEffect(() => {
    socket.on("error:room-full", (msg) => {
      toast.warn(msg);
    });

    socket.on("error:no-room", (msg) => {
      toast.warn(msg);
    });

    return () => {
      socket.off("error:room-full", (msg) => {
        toast.warn(msg);
      });

      socket.off("error:no-room", (msg) => {
        toast.warn(msg);
      });
    };
  }, []);

  return (
    <div
      id="join-screen"
      className="flex h-screen w-full bg-linear-to-br items-center justify-center"
    >
      <div className="w-100 md:w-175 rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-12 flex flex-col items-center gap-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white">
          Join a Room
        </h1>

        <p className="text-slate-300 text-md md:text-lg">
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
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-2xl py-2 px-2 md:py-5 md:px-6 text-center text-3xl md:text-5xl font-black tracking-[0.4em] uppercase text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition"
        />

        <button
          id="join-room-btn"
          className="w-full py-2 md:py-4 rounded-2xl bg-violet-600 text-white text-lg md:text-2xl font-semibold shadow-lg hover:bg-violet-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          onClick={() =>
            socket.emit("join", { code: ref.current.value, username: username })
          }
        >
          🚀 Join Room
        </button>

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
