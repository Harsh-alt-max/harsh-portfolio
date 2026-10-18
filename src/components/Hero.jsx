import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { scrollToSection } from "../lib/scroll";
import { site, hero } from "../content";
import Hero3D from "./Hero3D";

const LINES = site.nameLines;

function Chars({ text, lineIndex, ready }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={i}
          data-char={lineIndex}
          className="inline-block will-change-transform"
        >
          {c}
        </span>
      ))}
    </>
  );
}

/** Kinetic hero: giant name with staggered char entrance + mouse-reactive drift. */
export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const metaRef = useRef(null);

  // intro
  useEffect(() => {
    if (!ready) return;
    const chars = rootRef.current.querySelectorAll("[data-char]");
    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 110 });
      gsap.set(metaRef.current.children, { y: 24, opacity: 0 });
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(chars, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.028,
      }).to(
        metaRef.current.children,
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 },
        "-=0.7"
      );
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  // mouse-reactive drift: each line shifts at a different depth + skew
  useEffect(() => {
    const root = rootRef.current;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const setters = LINES.map((_, i) => ({
      x: gsap.quickTo(root.querySelector(`[data-line="${i}"]`), "x", {
        duration: 0.9,
        ease: "power3",
      }),
      skew: gsap.quickTo(root.querySelector(`[data-line="${i}"]`), "skewX", {
        duration: 0.9,
        ease: "power3",
      }),
    }));
    let lastX = null;

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      LINES.forEach((line, i) => {
        setters[i].x(nx * line.depth);
        if (lastX !== null) {
          const v = e.clientX - lastX;
          setters[i].skew(gsap.utils.clamp(-8, 8, v * -0.06));
        }
      });
      lastX = e.clientX;
    };
    const onLeave = () => {
      setters.forEach((s) => {
        s.x(0);
        s.skew(0);
      });
      lastX = null;
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pb-10 pt-28 md:px-12"
    >
      <Hero3D />
      {/* faint index marks */}
      <p className="pointer-events-none absolute right-6 top-24 hidden font-grotesk text-xs tracking-[0.3em] text-muted md:block md:right-12">
        {site.folioMark}
      </p>

      <h1 className="font-display uppercase leading-[0.85] tracking-tight">
        {LINES.map((line, li) => (
          <span key={line.text} className="block overflow-hidden pb-[0.06em]">
            <span
              data-line={li}
              className={`block text-[19.5vw] md:text-[17.5vw] ${
                line.style === "stroke" ? "text-stroke" : "text-paper"
              }`}
            >
              <Chars text={line.text} lineIndex={li} ready={ready} />
            </span>
          </span>
        ))}
      </h1>

      <div ref={metaRef} className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-grotesk text-sm font-bold uppercase tracking-[0.35em] text-lime">
            {hero.role}
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted md:text-lg">
            {hero.tagline}
          </p>
        </div>
        <button
          onClick={() => scrollToSection("#work")}
          data-hover
          className="group flex w-fit items-center gap-3 font-grotesk text-sm uppercase tracking-[0.25em] text-paper"
        >
          Scroll
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}
