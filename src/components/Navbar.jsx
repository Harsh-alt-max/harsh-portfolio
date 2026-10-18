import { useState } from "react";
import { scrollToSection } from "../lib/scroll";
import { useMagnetic } from "../hooks/useMagnetic";

const LINKS = [
  { label: "Work", target: "#work" },
  { label: "About", target: "#about" },
  { label: "Contact", target: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const logoRef = useMagnetic(0.4);

  const go = (target) => {
    setOpen(false);
    // wait a beat for the menu to close before scrolling
    setTimeout(() => scrollToSection(target), open ? 350 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[96] mix-blend-difference">
        <nav className="flex items-center justify-between px-6 py-5 text-paper md:px-12">
          <button
            ref={logoRef}
            onClick={() => go("#top")}
            data-hover
            className="font-grotesk text-sm font-bold tracking-[0.25em]"
          >
            HS®
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => go(l.target)}
                  data-hover
                  className="group relative font-grotesk text-sm tracking-[0.15em] uppercase"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen(!open)}
            data-hover
            aria-label="Menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-7 bg-paper transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-7 bg-paper transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-7 bg-paper transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-[94] flex flex-col justify-center bg-ink px-8 transition-all duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((l, i) => (
          <button
            key={l.label}
            onClick={() => go(l.target)}
            className={`border-b border-line py-5 text-left font-display text-5xl uppercase text-paper transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${i * 70}ms` : "0ms" }}
          >
            {l.label}
          </button>
        ))}
        <p className="mt-8 font-grotesk text-xs tracking-[0.3em] text-muted">
          HARSH KUMAR SINGH — © 2026
        </p>
      </div>
    </>
  );
}
