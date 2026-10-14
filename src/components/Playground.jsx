import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import Reveal from "./Reveal";

const EASES = [
  { name: "Power2", value: "power2.inOut" },
  { name: "Expo", value: "expo.inOut" },
  { name: "Elastic", value: "elastic.out(1, 0.45)" },
  { name: "Bounce", value: "bounce.out" },
  { name: "Back", value: "back.out(1.8)" },
];

const N = 64;

/** Sample an ease into an SVG path (x: time, y: eased value). */
function easePath(easeFn, w, h, pad) {
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const v = easeFn(t);
    const x = pad + t * (w - pad * 2);
    const y = h - pad - v * (h - pad * 2);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * Easing playground: pick a curve, watch a dot travel the track
 * and trace the same curve on the graph below.
 */
export default function Playground() {
  const [ease, setEase] = useState(EASES[2]);
  const [runs, setRuns] = useState(0);
  const dotRef = useRef(null);
  const traceRef = useRef(null);
  const trackRef = useRef(null);
  const W = 560;
  const H = 260;
  const PAD = 28;

  const easeFn = gsap.parseEase(ease.value);
  const path = easePath(easeFn, W, H, PAD);

  useEffect(() => {
    const track = trackRef.current;
    const dot = dotRef.current;
    const trace = traceRef.current;
    const state = { p: 0 };
    const maxX = track.clientWidth - 32;

    const tween = gsap.to(state, {
      p: 1,
      duration: 1.6,
      ease: ease.value,
      delay: 0.25,
      onUpdate: () => {
        const v = easeFn(state.p);
        gsap.set(dot, { x: v * maxX });
        const cx = PAD + state.p * (W - PAD * 2);
        const cy = H - PAD - v * (H - PAD * 2);
        gsap.set(trace, { x: cx, y: cy });
      },
    });
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, runs]);

  return (
    <section id="playground" className="border-t border-line px-6 py-24 md:px-12 md:py-36">
      <Reveal>
        <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-lime">Signature</p>
        <h2 className="mt-4 font-display text-6xl uppercase leading-none text-paper md:text-8xl">
          Easing
          <br />
          Playground
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Motion is in the details. Pick a curve — the same math behind every
          animation on this page — and watch it play.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <div className="flex flex-wrap gap-3">
          {EASES.map((e) => (
            <button
              key={e.name}
              data-hover
              onClick={() => {
                setEase(e);
                setRuns((r) => r + 1);
              }}
              className={`rounded-full border px-6 py-2.5 font-grotesk text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                e.name === ease.name
                  ? "border-lime bg-lime text-ink"
                  : "border-line text-paper/70 hover:border-paper/50 hover:text-paper"
              }`}
            >
              {e.name}
            </button>
          ))}
          <button
            data-hover
            onClick={() => setRuns((r) => r + 1)}
            className="rounded-full border border-line px-6 py-2.5 font-grotesk text-sm uppercase tracking-[0.15em] text-paper/70 transition-all duration-300 hover:border-lime hover:text-lime"
          >
            ↻ Replay
          </button>
        </div>

        {/* track */}
        <div ref={trackRef} className="relative mt-12 h-16 border-y border-line">
          <div className="absolute inset-y-0 left-4 right-4">
            <div
              ref={dotRef}
              className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_32px_rgba(215,255,62,0.5)]"
            />
          </div>
          <span className="absolute -bottom-7 left-0 font-grotesk text-xs text-muted">0ms</span>
          <span className="absolute -bottom-7 right-0 font-grotesk text-xs text-muted">1600ms</span>
        </div>

        {/* curve graph */}
        <div className="mt-16 overflow-hidden">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full max-w-2xl"
            role="img"
            aria-label={`${ease.name} easing curve`}
          >
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#232326" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#232326" strokeWidth="1" />
            <path d={path} fill="none" stroke="#d7ff3e" strokeWidth="2" />
            <g ref={traceRef}>
              <circle r="7" fill="#d7ff3e" />
              <circle r="12" fill="none" stroke="#d7ff3e" strokeOpacity="0.4" />
            </g>
          </svg>
          <p className="mt-3 font-grotesk text-xs uppercase tracking-[0.25em] text-muted">
            {ease.name} — {ease.value}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
