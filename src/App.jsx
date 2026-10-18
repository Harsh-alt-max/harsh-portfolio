import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/gsap";
import { setLenis, getLenis } from "./lib/scroll";

import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Work from "./components/Work";
import About from "./components/About";
import Contact from "./components/Contact";
import Guide from "./components/Guide";
import { guide } from "./content";

const GUIDE_STOPS = [
  { id: "#top", mood: "idle", msg: guide.messages.top },
  { id: "#work", mood: "idle", msg: guide.messages.work },
  { id: "#about", mood: "idle", msg: guide.messages.about },
  { id: "#contact", mood: "idle", msg: guide.messages.contact },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [guideMood, setGuideMood] = useState("point");
  const [guideMsg, setGuideMsg] = useState(guide.messages.top);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);

    // drive Lenis through GSAP's ticker so ScrollTrigger stays in sync
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // lock scroll during preloader
    lenis.stop();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const handleLoaded = () => {
    setReady(true);
    // resume smooth scrolling once the curtain lifts
    setTimeout(() => {
      getLenis()?.start();
      ScrollTrigger.refresh();
    }, 400);
  };

  // the 3D guide reacts to whichever section is on screen
  useEffect(() => {
    if (!ready) return;
    const triggers = GUIDE_STOPS.map(({ id, mood, msg }) =>
      ScrollTrigger.create({
        trigger: id,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) {
            setGuideMood(mood);
            setGuideMsg(msg);
          }
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  return (
    <div className="grain min-h-svh bg-ink text-paper">
      <Cursor />
      <ScrollProgress />
      {!ready && <Preloader onDone={handleLoaded} />}
      <Guide mood={guideMood} message={guideMsg} active={ready} />
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Work />
        <About />
        <Contact />
      </main>
    </div>
  );
}
