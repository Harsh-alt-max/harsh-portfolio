import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import Reveal from "./Reveal";

const portfolioCover = "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/08dfbe231756993.68a1bb3d00cbf.png";
const portfolioMotion = "https://mir-s3-cdn-cf.behance.net/project_modules/source/d2a8e0231756993.68a1c2561c620.gif";
const echoesCover = "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/4a3792233181081.69392a94bb084.jpg";
const echoesMotion = "https://mir-s3-cdn-cf.behance.net/project_modules/1400/f25731233181081.693422b7361d0.gif";

const PROJECTS = [
  {
    index: "01",
    title: "Portfolio 2026",
    desc: "Motion design pieces — including a tap/click micro-interaction built for Inshorts.",
    tags: ["Motion Design", "Advertising"],
    tools: ["After Effects", "Photoshop", "Illustrator"],
    cover: portfolioCover,
    motion: portfolioMotion,
    url: "https://www.behance.net/gallery/231756993/Portfolio-2026",
  },
  {
    index: "02",
    title: "Echoes",
    desc: "A mindfulness app concept — UI in Figma, interactive transitions in After Effects.",
    tags: ["UI/UX", "Motion"],
    tools: ["After Effects", "Figma"],
    cover: echoesCover,
    motion: echoesMotion,
    url: "https://www.behance.net/gallery/233181081/Echoes-A-Mindfullness-App-as-UI-Project",
  },
];

function Card({ project }) {
  const cardRef = useRef(null);
  const imgWrapRef = useRef(null);
  const stillRef = useRef(null);
  const motionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // parallax on the image as the card scrolls
  useEffect(() => {
    const tween = gsap.fromTo(
      imgWrapRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: cardRef.current, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const onEnter = () => {
    setInView(true);
    gsap.to(stillRef.current, { opacity: 0, scale: 1.06, duration: 0.6, ease: "power2.out" });
    gsap.to(motionRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector("[data-arrow]"), {
      x: 10,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const onLeave = () => {
    setInView(false);
    gsap.to(stillRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(motionRef.current, { opacity: 0, scale: 1.06, duration: 0.6, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector("[data-arrow]"), { x: 0, duration: 0.4, ease: "power3.out" });
  };

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      data-cursor="view"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block border-t border-line py-10 md:py-14"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-5">
          <span className="font-grotesk text-sm text-muted">{project.index}</span>
          <h3 className="font-display text-5xl uppercase leading-none text-paper transition-colors duration-300 group-hover:text-lime md:text-7xl">
            {project.title}
          </h3>
        </div>
        <span data-arrow className="font-grotesk text-2xl text-lime md:text-3xl">
          →
        </span>
      </div>

      <div className="mt-8 overflow-hidden">
        <div ref={imgWrapRef} className="relative aspect-[16/9] w-full will-change-transform md:aspect-[21/9]">
          <img
            ref={stillRef}
            src={project.cover}
            alt={`${project.title} cover`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <img
            ref={motionRef}
            src={project.motion}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">{project.desc}</p>
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
      </div>

      <span className="sr-only">{inView ? "Viewing motion preview" : ""}</span>
    </a>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-12 md:py-36">
      <Reveal>
        <div className="mb-10 flex items-end justify-between md:mb-16">
          <h2 className="font-display text-6xl uppercase leading-none text-paper md:text-8xl">
            Selected
            <br />
            Work
          </h2>
          <p className="hidden font-grotesk text-xs tracking-[0.3em] text-muted md:block">
            HOVER TO PREVIEW IN MOTION
          </p>
        </div>
      </Reveal>
      <div>
        {PROJECTS.map((p) => (
          <Card key={p.index} project={p} />
        ))}
      </div>
    </section>
  );
}
