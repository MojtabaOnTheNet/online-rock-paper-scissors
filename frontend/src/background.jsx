import gsap from "gsap";
import { useEffect } from "preact/hooks";

function Background() {
  // Background Parallex Effect
  useEffect(() => {
    const bgX = gsap.quickTo("#bg", "x", { duration: 0.5 });
    const bgY = gsap.quickTo("#bg", "y", { duration: 0.5 });

    const fgX = gsap.quickTo("#fg", "x", { duration: 0.5 });
    const fgY = gsap.quickTo("#fg", "y", { duration: 0.5 });

    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      bgX(x * 10);
      bgY(y * 10);

      fgX(x * 20);
      fgY(y * 20);
    });
  }, []);

  return (
    <>
      <div className="absolute inset-0 scale-105 -z-10 overflow-hidden">
        <img
          id="bg"
          src="layer1.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <img
          id="fg"
          src="layer2.png"
          alt=""
          className="absolute scale-[100%] inset-0 w-full h-full object-cover"
        />
      </div>
    </>
  );
}

export default Background;
