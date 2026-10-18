import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import Reveal from "./Reveal";
import { site, work } from "../content";

const PROJECTS = work.projects;

const THEMES = {
  sunset:
    "bg-[radial-gradient(120%_120%_at_20%_10%,#ff9a3c_0%,#e14d2a_38%,#4a1d3f_72%,#14141a_100%)]",
  lime:
    "bg-[radial-gradient(120%_120%_at_80%_20%,#d7ff3e_0%,#5c7a12_42%,#1c2110_75%,#101208_100%)]",
  violet:
    "bg-[radial-gradient(120%_120%_at_30%_80%,#8b5cf6_0%,#4c2bb3_40%,#1d1440_72%,#0d0b18_100%)]",
  mono:
    "bg-[radial-gradient(120%_120%_at_50%_50%,#3d3d46_0%,#1b1b21_55%,#0b0b0c_100%)]",
};

function Cover({ project }) {
  // real artwork when the project has it, art-directed tile otherwise
  if (project.cover) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={project.cover}
          alt={`${project.title} cover`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {project.motion && (
          <img
            src={project.motion}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${THEMES[project.theme] || THEMES.mono}`}
    >
      {/* giant ghost number */}
      <span className="font-display text-[26vw] leading-none text-transparent opacity-40 md:text-[16vw] [-webkit-text-stroke:2px_rgba(236,234,227,0.55)]">
        {project.index}
      </span>
      {/* scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.55)_4px)]" />
      {/* sheen sweep on hover */}
      <div className="sheen pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
    </div>
  );
}

function Card({ project }) {
  const cardRef = useRef(null);
  const imgWrapRef = useRef(null);
  const tilt = useRef(null);
  const isLive = Boolean(project.url);
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  // parallax on the cover as the card scrolls
  useEffect(() => {
    const tween = gsap.fromTo(
      imgWrapRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // 3D tilt setup (fine pointers only)
  useEffect(() => {
    if (!fine || !cardRef.current) return;
    gsap.set(cardRef.current, { transformPerspective: 1100 });
    tilt.current = {
      rx: gsap.quickTo(cardRef.current, "rotationX", { duration: 0.7, ease: "power3" }),
      ry: gsap.quickTo(cardRef.current, "rotationY", { duration: 0.7, ease: "power3" }),
    };
  }, [fine]);

  // card entrance
  useEffect(() => {
    const tween = gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const onMove = (e) => {
    if (!tilt.current || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.ry(nx * 7);
    tilt.current.rx(-ny * 7);
  };
  const onEnter = () => {
    gsap.to(imgWrapRef.current, { scale: 1.04, duration: 0.7, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector("[data-arrow]"), {
      x: 10,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.fromTo(
      cardRef.current.querySelector(".sheen"),
      { xPercent: -110 },
      { xPercent: 110, duration: 0.9, ease: "power2.inOut" }
    );
  };
  const onLeave = () => {
    gsap.to(imgWrapRef.current, { scale: 1, duration: 0.7, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector("[data-arrow]"), {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });
    tilt.current?.rx(0);
    tilt.current?.ry(0);
  };

  const Tag = isLive ? "a" : "div";
  const tagProps = isLive
    ? { href: project.url, target: "_blank", rel: "noreferrer", "data-cursor": "view" }
    : {};

  return (
    <Tag
      ref={cardRef}
      {...tagProps}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className="group block border-t border-line py-10 opacity-0 md:py-14"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-5">
          <span className="font-grotesk text-sm text-muted">{project.index}</span>
          <h3 className="font-display text-4xl uppercase leading-[0.95] text-paper transition-colors duration-300 group-hover:text-lime md:text-7xl">
            {project.title}
          </h3>
        </div>
        <span data-arrow className="shrink-0 font-grotesk text-2xl text-lime md:text-3xl">
          {isLive ? "→" : "○"}
        </span>
      </div>

      <div className="mt-8 overflow-hidden">
        <div
          ref={imgWrapRef}
          className="relative aspect-[16/9] w-full will-change-transform md:aspect-[21/9]"
        >
          <Cover project={project} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">{project.desc}</p>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap gap-2">
            {[...project.tags, ...project.tools].map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-4 py-1.5 font-grotesk text-xs uppercase tracking-[0.15em] text-paper/80"
              >
                {t}
              </span>
            ))}
          </div>
          {isLive ? (
            <span className="font-grotesk text-xs uppercase tracking-[0.25em] text-lime">
              View on Behance →
            </span>
          ) : (
            <span className="rounded-full bg-lime/10 px-4 py-1.5 font-grotesk text-xs uppercase tracking-[0.25em] text-lime">
              {work.comingSoon}
            </span>
          )}
        </div>
      </div>
    </Tag>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-12 md:py-36">
      <Reveal>
        <p className="mb-6 font-grotesk text-xs uppercase tracking-[0.35em] text-lime">
          {work.kicker}
        </p>
        <div className="mb-10 flex items-end justify-between md:mb-16">
          <h2 className="font-display text-6xl uppercase leading-none text-paper md:text-8xl">
            {work.titleLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="hidden font-grotesk text-xs tracking-[0.3em] text-muted md:block">
            {work.hint}
          </p>
        </div>
      </Reveal>
      <div>
        {PROJECTS.map((p) => (
          <Card key={p.index} project={p} />
        ))}
      </div>
      <Reveal>
        <p className="mt-12 text-center font-grotesk text-sm uppercase tracking-[0.25em] text-muted">
          Full archive lives on{" "}
          <a
            href={site.behanceUrl}
            target="_blank"
            rel="noreferrer"
            data-hover
            className="text-lime underline-offset-4 hover:underline"
          >
            Behance
          </a>
        </p>
      </Reveal>
    </section>
  );
}
