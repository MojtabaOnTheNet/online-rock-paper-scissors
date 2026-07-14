import gsap from "gsap";
import { useEffect, useRef, useState } from "preact/hooks";

function Game({
  playerName,
  opponentName,
  score,
  opponentScore,
  roundText,
  onChoice,
  onLeave,
  nextRound,
  tempChoices,
}) {
  const [choice, setChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const idleTween = useRef(null);
  const images = {
    rock: "rpcRock.png",
    paper: "rpcPaper.png",
    scissors: "rpcScissors.png",
  };

  const handleLeave = () => {
    idleTween.current?.kill();

    gsap.to(leftHandRef.current, {
      x: -600,
      duration: 0.6,
      ease: "power3.in",
    });

    gsap.to(rightHandRef.current, {
      x: 600,
      duration: 0.6,
      ease: "power3.in",
      onComplete: onLeave, // unmount after animation
    });
  };

  useEffect(() => {
    setChoice("");
    setSubmitted(false);
  }, [nextRound]);

  useEffect(() => {
    gsap.fromTo(
      leftHandRef.current,
      {
        x: -600, // Start off-screen to the left
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          idleTween.current = gsap.to(leftHandRef.current, {
            y: -8,
            rotation: 2,
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      },
    );

    gsap.fromTo(
      rightHandRef.current,
      {
        x: 600, // Start off-screen to the right
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          idleTween.current = gsap.to(rightHandRef.current, {
            y: -8,
            rotation: -2,
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      },
    );

    return () => idleTween.current?.kill();
  }, []);

  useEffect(() => {
    if (!leftHandRef.current || !choice) return;

    idleTween.current?.pause();

    gsap
      .timeline({
        onComplete: () => idleTween.current?.resume(),
      })
      .to(leftHandRef.current, {
        y: -18,
        scale: 1.02,
        duration: 0.15,
        ease: "power2.out",
      })
      .to(leftHandRef.current, {
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: "bounce.out",
      });
  }, [choice]);

  return (
    <>
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
            onClick={() => setChoice("rock")}
            className={`w-44 h-44 rounded-3xl bg-slate-900 border-2  hover:border-emerald-400 hover:scale-105 transition-all text-7xl cursor-pointer ${choice === "rock" ? "border-emerald-400 disabled:hover:border-emerald-400" : "border-slate-700 disabled:opacity-40 disabled:hover:border-slate-700"} disabled:cursor-default  disabled:hover:scale-100`}
            disabled={submitted}
          >
            ✊
          </button>

          <button
            onClick={() => setChoice("paper")}
            className={`w-44 h-44 rounded-3xl bg-slate-900 border-2  hover:border-violet-400 hover:scale-105 transition-all text-7xl cursor-pointer ${choice === "paper" ? "border-violet-400 disabled:hover:border-violet-400" : "border-slate-700 disabled:opacity-40 disabled:hover:border-slate-700"} disabled:cursor-default disabled:hover:scale-100`}
            disabled={submitted}
          >
            ✋
          </button>

          <button
            onClick={() => setChoice("scissors")}
            className={`w-44 h-44 rounded-3xl bg-slate-900 border-2  hover:border-amber-400 hover:scale-105 transition-all text-7xl cursor-pointer ${choice === "scissors" ? "border-amber-400 disabled:hover:border-amber-400" : "border-slate-700 disabled:opacity-40 disabled:hover:border-slate-700"} disabled:cursor-default  disabled:hover:scale-100`}
            disabled={submitted}
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
            onClick={() => {
              onChoice(choice);
              setSubmitted(true);
            }}
            className="px-6 py-3 rounded-xl disabled:cursor-default disabled:bg-gray-500 bg-green-500 text-white font-semibold hover:bg-red-400 transition cursor-pointer"
            disabled={choice === ""}
          >
            Submit
          </button>

          <button
            onClick={handleLeave}
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition cursor-pointer"
          >
            Leave Game
          </button>
        </div>
      </div>
      <img
        ref={leftHandRef}
        src={images[choice] || "rpcDefault.png"}
        alt=""
        className="absolute top-70 left-0 w-150"
      />
      <img
        ref={rightHandRef}
        src={images[tempChoices] || "rpcDefault.png"}
        alt=""
        className="absolute top-70 right-0 rotate-y-180 w-150"
      />
    </>
  );
}

export default Game;
