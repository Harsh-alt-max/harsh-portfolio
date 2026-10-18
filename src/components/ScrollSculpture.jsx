import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { sculpture } from "../content";

// shared 0..1 scroll progress through the sticky section
const progress = { v: 0 };

function Knot() {
  const knot = useRef();
  const wire = useRef();
  const distort = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress.v;
    if (knot.current) {
      // scrub-driven spin + a slow ambient rotation
      knot.current.rotation.y = t * 0.12 + p * Math.PI * 3;
      knot.current.rotation.x = 0.35 + p * 1.1;
      const s = 1 + Math.sin(p * Math.PI) * 0.22;
      knot.current.scale.setScalar(s);
    }
    if (distort.current) distort.current.distort = 0.28 + p * 0.55;
    if (wire.current) {
      wire.current.rotation.y = -t * 0.08 - p * Math.PI * 2;
      wire.current.rotation.z = p * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.05, 0.32, 180, 28]} />
        <MeshDistortMaterial
          ref={distort}
          color="#17171c"
          roughness={0.35}
          metalness={0.65}
          distort={0.28}
          speed={1.6}
        />
      </mesh>
      {/* lime wireframe shell — the accent */}
      <mesh ref={wire} scale={1.18}>
        <torusKnotGeometry args={[1.05, 0.32, 120, 20]} />
        <meshBasicMaterial color="#d7ff3e" wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

/**
 * Sticky 3D interlude between Work and Playground:
 * a distorted torus knot that twists and breathes as you scroll through it.
 */
export default function ScrollSculpture() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        progress.v = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="sculpture" ref={sectionRef} className="relative h-[220vh]" aria-hidden>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4.6], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 5]} intensity={1.8} />
          <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#d7ff3e" />
          <Knot />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 px-6 text-center">
          <p className="font-grotesk text-xs uppercase tracking-[0.35em] text-lime">
            {sculpture.kicker}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted">{sculpture.caption}</p>
        </div>
        {/* fade edges into the page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}
