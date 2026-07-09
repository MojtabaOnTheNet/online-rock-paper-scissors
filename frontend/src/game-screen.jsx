function Game({
  playerName,
  opponentName,
  score,
  opponentScore,
  roundText,
  onChoice,
  onLeave,
}) {
  return (
    <div className="w-225 rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-10 flex flex-col gap-10">
      {/* Top */}
      <div className="flex justify-between items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{playerName}</h2>

          <p className="text-5xl font-black text-emerald-400 mt-2">{score}</p>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black text-white">VS</h1>

          <p className="mt-3 text-slate-300">{roundText}</p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{opponentName}</h2>

          <p className="text-5xl font-black text-violet-400 mt-2">
            {opponentScore}
          </p>
        </div>
      </div>

      {/* Choices */}

      <div className="flex justify-center gap-8">
        <button
          onClick={() => onChoice("rock")}
          className="w-44 h-44 rounded-3xl bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 hover:scale-105 transition-all text-7xl cursor-pointer"
        >
          ✊
        </button>

        <button
          onClick={() => onChoice("paper")}
          className="w-44 h-44 rounded-3xl bg-slate-900 border-2 border-slate-700 hover:border-violet-400 hover:scale-105 transition-all text-7xl cursor-pointer"
        >
          ✋
        </button>

        <button
          onClick={() => onChoice("scissors")}
          className="w-44 h-44 rounded-3xl bg-slate-900 border-2 border-slate-700 hover:border-amber-400 hover:scale-105 transition-all text-7xl cursor-pointer"
        >
          ✌️
        </button>
      </div>

      {/* Bottom */}

      <div className="flex justify-between items-center">
        <div className="text-slate-300 text-lg">
          First to <span className="font-bold text-white">5</span> wins
        </div>

        <button
          onClick={onLeave}
          className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition cursor-pointer"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
}

export default Game;
