import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "../lib/gsap";
import { guide } from "../content";

// look, tuned in content.js → guide.orb (no 3D code needs touching)
const M = guide.orb;

// shared pointer in -1..1, updated globally
const pointer = { x: 0, y: 0 };

/* ------------------------------------------------------------------ */
/* Rig: gentle float + lean-toward-cursor + soft pulse on click        */
/* ------------------------------------------------------------------ */
function FloatRig({ moodRef, pulseRef, children }) {
  const outer = useRef();
  const inner = useRef();

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const g = outer.current;
    if (!g) return;

    g.position.y = Math.sin(t * 1.4) * 0.05;
    g.rotation.z = Math.sin(t * 0.8) * 0.03;
    g.rotation.y += (pointer.x * 0.25 - g.rotation.y) * 0.06;
    g.rotation.x += (-pointer.y * 0.15 - g.rotation.x) * 0.06;

    // click pulse: one soft breath, then rest
    if (pulseRef.current != null && inner.current) {
      pulseRef.current += dt * 2.6;
      const k = pulseRef.current;
      const s = 1 + Math.sin(Math.min(k, Math.PI)) * 0.16;
      inner.current.scale.set(s, s, s);
      if (k >= Math.PI) {
        pulseRef.current = null;
        inner.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={outer} position={[0, 0.05, 0]} scale={0.92}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orb: a minimal circle companion. Quiet by design — a soft glow,     */
/* a thin ring, two small eyes that follow the cursor and blink.       */
/* ------------------------------------------------------------------ */
function Orb() {
  const eyeL = useRef();
  const eyeR = useRef();
  const group = useRef();
  const blink = useRef({ t: 0, next: 2.5 });

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;

    // eyes drift toward the cursor
    const px = pointer.x * 0.03;
    const py = pointer.y * 0.025;
    for (const e of [eyeL.current, eyeR.current]) {
      if (!e) continue;
      e.position.x += (e.userData.bx + px - e.position.x) * 0.12;
      e.position.y += (e.userData.by + py - e.position.y) * 0.12;
    }

    // blink
    blink.current.t += dt;
    if (blink.current.t > blink.current.next) {
      blink.current.t = 0;
      blink.current.next = 2.5 + Math.random() * 3;
      const scales = [eyeL.current?.scale, eyeR.current?.scale].filter(Boolean);
      if (scales.length)
        gsap.to(scales, { y: 0.15, duration: 0.08, yoyo: true, repeat: 1, overwrite: "auto" });
    }

    // breathing
    if (group.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.02;
      group.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={group}>
      {/* soft halo */}
      <mesh>
        <circleGeometry args={[0.68, 48]} />
        <meshBasicMaterial color={M.glow} transparent opacity={0.1} />
      </mesh>
      {/* thin ring */}
      <mesh>
        <ringGeometry args={[0.5, 0.54, 64]} />
        <meshBasicMaterial color={M.ring} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* face dot */}
      <mesh>
        <circleGeometry args={[0.36, 48]} />
        <meshStandardMaterial color={M.dot} roughness={0.4} />
      </mesh>
      {/* eyes */}
      {[
        [-0.12, 0.07],
        [0.12, 0.07],
      ].map(([x, y], i) => (
        <mesh
          key={i}
          ref={i === 0 ? eyeL : eyeR}
          position={[x, y, 0.012]}
          userData={{ bx: x, by: y }}
        >
          <circleGeometry args={[0.045, 20]} />
          <meshBasicMaterial color={M.eye} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Optional real model: drop public/character.glb and it swaps in.     */
/* ------------------------------------------------------------------ */
function UserModel() {
  const { scene } = useGLTF(import.meta.env.BASE_URL + "character.glb");
  // tune scale/position here if your model sits too high or low
  return <primitive object={scene} scale={1.15} position={[0, -0.85, 0]} />;
}

class ModelBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Fixed minimal guide: a quiet circle companion.
 * Eyes follow the cursor, it breathes gently, shows a short line
 * per section, and pulses with a tip when clicked.
 * Drop your own character.glb in public/ and it swaps in automatically.
 */
export default function Guide({ mood, message, active }) {
  const moodRef = useRef(mood);
  const pulseRef = useRef(null);
  const wrapRef = useRef(null);
  const bubbleRef = useRef(null);
  const hideTimer = useRef(null);
  const [tip, setTip] = useState(null);

  const shown = tip || message;

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  // a new section line clears any clicked tip
  useEffect(() => {
    setTip(null);
  }, [message]);

  // global pointer tracking
  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // entrance — quiet fade, no bounce
  useEffect(() => {
    if (!active || !wrapRef.current) return;
    gsap.fromTo(
      wrapRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.6 }
    );
  }, [active]);

  // speech bubble: soft fade in on message change, then fade out
  useEffect(() => {
    if (!active || !shown || !bubbleRef.current) return;
    const b = bubbleRef.current;
    clearTimeout(hideTimer.current);
    gsap.killTweensOf(b);
    gsap.fromTo(
      b,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    hideTimer.current = setTimeout(() => {
      gsap.to(b, { opacity: 0, y: 6, duration: 0.4, ease: "power2.in" });
    }, 5200);
    return () => clearTimeout(hideTimer.current);
  }, [shown, active]);

  const onPoke = () => {
    pulseRef.current = 0;
    const pool = guide.tips.filter((t) => t !== tip);
    setTip(pool[Math.floor(Math.random() * pool.length)]);
  };

  if (!active) return null;

  const orb = <Orb />;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed bottom-5 right-5 z-[80] opacity-0 md:bottom-8 md:right-8"
      aria-hidden
    >
      {/* speech pill */}
      <div className="flex justify-end">
        <div
          ref={bubbleRef}
          className="mb-3 max-w-[240px] rounded-full border border-line bg-ink/90 px-5 py-2.5 opacity-0 backdrop-blur-sm"
        >
          <p className="text-[12.5px] leading-snug text-paper/85">{shown}</p>
        </div>
      </div>
      {/* orb canvas — the only clickable part, so content stays clickable */}
      <div
        className="pointer-events-auto relative ml-auto h-[110px] w-[110px] cursor-pointer md:h-[140px] md:w-[140px]"
        onClick={onPoke}
        data-hover
      >
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 3, 4]} intensity={1.1} />
          <FloatRig moodRef={moodRef} pulseRef={pulseRef}>
            <Suspense fallback={orb}>
              <ModelBoundary fallback={orb}>
                <UserModel />
              </ModelBoundary>
            </Suspense>
          </FloatRig>
        </Canvas>
      </div>
    </div>
  );
}
