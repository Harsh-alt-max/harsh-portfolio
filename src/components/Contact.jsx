import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useMagnetic } from "../hooks/useMagnetic";
import Reveal from "./Reveal";
import { contact, site } from "../content";

export default function Contact() {
  const btnRef = useMagnetic(0.45);
  const titleRef = useRef(null);

  // giant title drifts in on scroll
  useEffect(() => {
    const tween = gsap.fromTo(
      titleRef.current,
      { yPercent: 30, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer id="contact" className="border-t border-line px-6 pb-10 pt-24 md:px-12 md:pt-36">
      <Reveal>
        <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-lime">{contact.kicker}</p>
      </Reveal>
      <h2
        ref={titleRef}
        className="mt-6 font-display uppercase leading-[0.9] text-paper"
        style={{ fontSize: "clamp(3rem, 11vw, 10rem)" }}
      >
        {contact.titleA}
        <br />
        {contact.titleB} <span className="text-lime">{contact.titleAccent}</span>
      </h2>

      <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <a
          ref={btnRef}
          href={site.behanceUrl}
          target="_blank"
          rel="noreferrer"
          data-hover
          className="inline-flex w-fit items-center gap-4 rounded-full bg-lime px-10 py-5 font-grotesk text-sm font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          {contact.button}
          <span aria-hidden>↗</span>
        </a>
        <div className="font-grotesk text-sm uppercase tracking-[0.2em] text-muted">
          <p>{contact.name}</p>
          <p className="mt-2">{contact.location}</p>
        </div>
      </div>

      <div className="mt-20 flex items-center justify-between border-t border-line pt-6 font-grotesk text-xs uppercase tracking-[0.25em] text-muted">
        <span>{contact.copyright}</span>
        <span className="hidden md:inline">{contact.footerNote}</span>
        <a
          href={site.behanceUrl}
          target="_blank"
          rel="noreferrer"
          data-hover
          className="transition-colors duration-300 hover:text-lime"
        >
          Behance ↗
        </a>
      </div>
    </footer>
  );
}
