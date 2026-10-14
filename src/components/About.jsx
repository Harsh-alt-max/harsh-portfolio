import Reveal from "./Reveal";

const TOOLS = ["After Effects", "Photoshop", "Illustrator", "Figma"];

export default function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-12 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-lime">About</p>
            <h2 className="mt-4 font-display text-6xl uppercase leading-none text-paper md:text-7xl">
              Behind
              <br />
              the motion
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-7">
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-2xl leading-snug text-paper md:text-4xl">
              Visual storyteller and motion designer. I blend media, design and
              motion to turn ideas into stories — with an eye for minimalism.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Currently designing movement at Inshorts, Noida — where millions of
              people feel my work every day, one tap at a time.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10">
              <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-muted">
                Tools of the trade
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
                {TOOLS.map((t) => (
                  <li
                    key={t}
                    data-hover
                    className="group bg-ink px-5 py-6 transition-colors duration-300 hover:bg-ink-soft"
                  >
                    <span className="font-grotesk text-sm uppercase tracking-[0.12em] text-paper/80 transition-colors duration-300 group-hover:text-lime">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
