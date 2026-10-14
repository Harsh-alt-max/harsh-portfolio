import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/** Fade-and-rise reveal on scroll. Wraps any children. */
export default function Reveal({ children, delay = 0, y = 48, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
