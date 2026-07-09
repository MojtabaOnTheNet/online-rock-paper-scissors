function Home({ onHost, onJoin }) {
  return (
    <div
      id="home-screen"
      className="w-175 h-95 bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center gap-10"
    >
      <h1 className="text-5xl font-bold text-white tracking-wide">
        Rock Paper Scissors
      </h1>

      <p className="text-slate-300 text-lg">
        Create a room or join an existing one.
      </p>

      <div className="flex gap-8">
        <button
          className="px-14 py-5 rounded-2xl bg-emerald-500 text-white text-2xl font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          id="host"
          onClick={onHost}
        >
          🎮 Host
        </button>

        <button
          className="px-14 py-5 rounded-2xl bg-violet-600 text-white text-2xl font-semibold shadow-lg hover:bg-violet-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          id="join"
          onClick={onJoin}
        >
          🚀 Join
        </button>
      </div>
    </div>
  );
}

export default Home;
