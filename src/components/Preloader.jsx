import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";

/** Full-screen preloader: counts 0→100, then curtain-lifts. */
export default function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => onDone && onDone(),
    });

    tl.to(counter, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .to(barRef.current, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(".preloader-word", {
        yPercent: -110,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: 0.06,
      })
      .to(
        rootRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        "-=0.35"
      )
      .set(rootRef.current, { display: "none" });

    return () => tl.kill();
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-6 py-8 md:px-12"
    >
      <div className="overflow-hidden">
        <p className="preloader-word font-grotesk text-sm tracking-[0.3em] text-muted">
          PORTFOLIO © 2026
        </p>
      </div>
      <div className="flex items-end justify-between">
        <div className="overflow-hidden">
          <h1 className="preloader-word font-display text-[18vw] leading-none text-paper md:text-[10vw]">
            HARSH
          </h1>
        </div>
        <span className="font-grotesk text-6xl text-lime md:text-8xl tabular-nums">
          {count}
        </span>
      </div>
      <div className="h-px w-full bg-line">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  );
}
