import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** Thin lime progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[95] h-[3px]">
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-lime" />
    </div>
  );
}
