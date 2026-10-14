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
import Playground from "./components/Playground";
import About from "./components/About";
import Contact from "./components/Contact";

export default function App() {
  const [ready, setReady] = useState(false);

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

  return (
    <div className="grain min-h-svh bg-ink text-paper">
      <Cursor />
      <ScrollProgress />
      {!ready && <Preloader onDone={handleLoaded} />}
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Work />
        <Playground />
        <About />
        <Contact />
      </main>
    </div>
  );
}
