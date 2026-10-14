import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/**
 * Custom cursor: a small dot + trailing ring. Grows over interactive
 * elements ([data-hover]) and shows a "VIEW" label over work cards.
 * Disabled on touch devices.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("cursor-on");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const onOver = (e) => {
      const viewTarget = e.target.closest("[data-cursor='view']");
      const hoverTarget = e.target.closest("[data-hover], a, button");
      if (viewTarget) {
        gsap.to(ring, {
          scale: 4.2,
          backgroundColor: "rgba(215,255,62,1)",
          borderColor: "rgba(215,255,62,0)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 1, duration: 0.25 });
        gsap.to(dot, { scale: 0, duration: 0.25 });
      } else if (hoverTarget) {
        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: "rgba(215,255,62,0)",
          borderColor: "rgba(236,234,227,0.6)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { scale: 0.5, duration: 0.25 });
      } else {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "rgba(215,255,62,0)",
          borderColor: "rgba(236,234,227,0.6)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { scale: 1, duration: 0.25 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("cursor-on");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/60"
      >
        <span ref={labelRef} className="font-grotesk text-[10px] font-bold tracking-[0.2em] text-ink opacity-0">
          VIEW
        </span>
      </div>
    </div>
  );
}
