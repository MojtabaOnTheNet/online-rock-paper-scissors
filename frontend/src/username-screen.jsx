import { createRef } from "preact";
import { useState } from "preact/hooks";

function Username({ onContinue }) {
  const [username, setUsername] = useState("");
  const ref = createRef();

  return (
    <div className="w-175 rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-12 flex flex-col items-center gap-8">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-white">Welcome!</h1>

        <p className="text-slate-300 text-lg">
          Choose a username before you start playing.
        </p>
      </div>

      <input
        ref={ref}
        value={username}
        onChange={(e) => setUsername(ref.current.value)}
        id="username"
        type="text"
        maxLength={20}
        autoComplete="off"
        spellcheck={false}
        placeholder="Enter your username..."
        className="w-full rounded-2xl bg-slate-900 border-2 border-slate-600 px-6 py-5 text-center text-2xl font-semibold text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition"
      />

      <button
        onClick={() => {
          localStorage.setItem("username", username);

          onContinue(username);
        }}
        className="w-full rounded-2xl bg-indigo-600 py-4 text-2xl font-semibold text-white shadow-lg transition-all duration-200 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 cursor-pointer"
        disabled={username.trim() === ""}
      >
        Continue
      </button>

      <p className="text-sm text-slate-400">
        Your username will be shown to your opponent.
      </p>
    </div>
  );
}

export default Username;
