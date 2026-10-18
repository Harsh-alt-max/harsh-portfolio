import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { gsap } from "../lib/gsap";
import { guide } from "../content";

// look, tuned in content.js → guide.mascot (no 3D code needs touching)
const M = guide.mascot;

// shared pointer in -1..1, updated globally
const pointer = { x: 0, y: 0 };

/* ------------------------------------------------------------------ */
/* Rig: idle float + lean-toward-cursor + click spin, wraps any model   */
/* ------------------------------------------------------------------ */
function FloatRig({ moodRef, spinRef, children }) {
  const outer = useRef();
  const inner = useRef();

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const g = outer.current;
    if (!g) return;
    const mood = moodRef.current;

    let y = Math.sin(t * 1.7) * 0.07;
    let rz = Math.sin(t * 0.9) * 0.045;
    if (mood === "celebrate") {
      y = Math.abs(Math.sin(t * 5.5)) * 0.32;
      rz = Math.sin(t * 5.5) * 0.09;
    }
    g.position.y = y;
    g.rotation.z = rz;
    g.rotation.y += (pointer.x * 0.4 - g.rotation.y) * 0.07;
    g.rotation.x += (-pointer.y * 0.22 - g.rotation.x) * 0.07;

    // click spin: one full turn, then hand control back
    if (spinRef.current != null && inner.current) {
      spinRef.current += dt * 11;
      inner.current.rotation.y = spinRef.current;
      if (spinRef.current >= Math.PI * 2) {
        spinRef.current = null;
        inner.current.rotation.y = 0;
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
/* Mascot: friendly mini lookalike, built from primitives.              */
/* Big head, minimal face — all colors from guide.mascot in content.js  */
/* ------------------------------------------------------------------ */
function Mascot({ moodRef }) {
  const eyeL = useRef();
  const eyeR = useRef();
  const pupilL = useRef();
  const pupilR = useRef();
  const armL = useRef();
  const armR = useRef();
  const blink = useRef({ t: 0, next: 2.2 });
  const waveT = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const mood = moodRef.current;

    // pupils track the cursor
    const px = pointer.x * 0.05;
    const py = pointer.y * 0.04 + 0.008;
    for (const p of [pupilL.current, pupilR.current]) {
      if (!p) continue;
      p.position.x += (px - p.position.x) * 0.18;
      p.position.y += (py - p.position.y) * 0.18;
    }

    // blink
    blink.current.t += dt;
    if (blink.current.t > blink.current.next) {
      blink.current.t = 0;
      blink.current.next = 2 + Math.random() * 3.2;
      const scales = [eyeL.current?.scale, eyeR.current?.scale].filter(Boolean);
      if (scales.length)
        gsap.to(scales, { y: 0.1, duration: 0.07, yoyo: true, repeat: 1, overwrite: "auto" });
    }

    // arms by mood
    const k = 0.14;
    const al = armL.current;
    const ar = armR.current;
    if (!al || !ar) return;
    if (mood === "wave") {
      waveT.current += dt * 11;
      ar.rotation.z += (-2.35 + Math.sin(waveT.current) * 0.5 - ar.rotation.z) * 0.35;
      al.rotation.z += (0.45 - al.rotation.z) * k;
    } else if (mood === "point") {
      ar.rotation.z += (-2.85 - ar.rotation.z) * k;
      ar.rotation.x += (-0.35 - ar.rotation.x) * k;
      al.rotation.z += (0.45 - al.rotation.z) * k;
      al.rotation.x += (0 - al.rotation.x) * k;
    } else if (mood === "celebrate") {
      ar.rotation.z += (-2.7 - ar.rotation.z) * 0.2;
      al.rotation.z += (2.7 - al.rotation.z) * 0.2;
      ar.rotation.x += (0 - ar.rotation.x) * k;
      al.rotation.x += (0 - al.rotation.x) * k;
    } else {
      ar.rotation.z += (-0.5 - ar.rotation.z) * k;
      al.rotation.z += (0.5 - al.rotation.z) * k;
      ar.rotation.x += (0 - ar.rotation.x) * k;
      al.rotation.x += (0 - al.rotation.x) * k;
    }
  });

  return (
    <group>
      {/* ---- big head ---- */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.5, 40, 40]} />
        <meshStandardMaterial color={M.skin} roughness={0.55} />
      </mesh>
      {/* hair cap — tall and wavy */}
      <mesh position={[0, 0.62, -0.05]} scale={[1.04, 1.14, 1.04]}>
        <sphereGeometry args={[0.56, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={M.hair} roughness={0.7} />
      </mesh>
      {/* wavy fringe tufts swept up */}
      {[
        [-0.17, 1.08, 0.3, 0.13],
        [0.04, 1.14, 0.28, 0.15],
        [0.24, 1.06, 0.22, 0.11],
        [-0.3, 0.98, 0.14, 0.1],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 14, 14]} />
          <meshStandardMaterial color={M.hair} roughness={0.7} />
        </mesh>
      ))}
      {/* eyes */}
      {[-0.185, 0.185].map((x, i) => (
        <group key={x} position={[x, 0.6, 0.4]}>
          <mesh ref={i === 0 ? eyeL : eyeR}>
            <sphereGeometry args={[0.115, 24, 24]} />
            <meshStandardMaterial color="#f7f5ef" roughness={0.25} />
          </mesh>
          <mesh ref={i === 0 ? pupilL : pupilR} position={[0, 0.008, 0.085]}>
            <sphereGeometry args={[0.052, 16, 16]} />
            <meshStandardMaterial color="#14100d" roughness={0.2} />
          </mesh>
          <mesh position={[0.018, 0.03, 0.125]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      {/* smile */}
      <mesh position={[0, 0.36, 0.44]} rotation={[-0.12, 0, Math.PI]}>
        <torusGeometry args={[0.085, 0.02, 8, 20, Math.PI]} />
        <meshBasicMaterial color="#2a201a" />
      </mesh>
      {/* mustache */}
      <mesh position={[0, 0.455, 0.465]} scale={[1.7, 0.55, 0.6]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={M.hair} roughness={0.7} />
      </mesh>
      {/* chin beard */}
      <mesh position={[0, 0.3, 0.4]} rotation={[-0.35, 0, Math.PI]}>
        <torusGeometry args={[0.11, 0.045, 8, 20, Math.PI]} />
        <meshStandardMaterial color={M.hair} roughness={0.7} />
      </mesh>
      {/* jaw sideburns */}
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.45, 0.28]} scale={[0.55, 1.1, 0.7]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={M.hair} roughness={0.7} />
        </mesh>
      ))}
      {/* earbuds — like his */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.06]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={M.earbuds} roughness={0.35} />
        </mesh>
      ))}

      {/* ---- body ---- */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color={M.skin} roughness={0.55} />
      </mesh>
      {/* collar */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.045, 10, 24]} />
        <meshStandardMaterial color={M.accent} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.35, 0]} scale={[1, 1, 0.88]}>
        <capsuleGeometry args={[0.4, 0.5, 8, 20]} />
        <meshStandardMaterial color={M.outfit} roughness={0.6} />
      </mesh>

      {/* arms (pivot at shoulder) */}
      <group ref={armL} position={[-0.46, -0.08, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.085, 0.26, 6, 12]} />
          <meshStandardMaterial color={M.outfit} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={M.skin} roughness={0.55} />
        </mesh>
      </group>
      <group ref={armR} position={[0.46, -0.08, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.085, 0.26, 6, 12]} />
          <meshStandardMaterial color={M.outfit} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={M.skin} roughness={0.55} />
        </mesh>
      </group>

      {/* legs + shoes */}
      {[-0.17, 0.17].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.95, 0]}>
            <capsuleGeometry args={[0.11, 0.3, 6, 12]} />
            <meshStandardMaterial color={M.pants} roughness={0.65} />
          </mesh>
          <mesh position={[x, -1.18, 0.05]} scale={[1, 0.7, 1.3]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={M.accent} roughness={0.45} />
          </mesh>
        </group>
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
 * Fixed 3D guide: a little mascot who follows the visitor —
 * eyes track the cursor, waves/points/celebrates per section,
 * spins and drops a tip when clicked, and talks via speech bubble.
 * Drop your own character.glb in public/ and he swaps in automatically.
 */
export default function Guide({ mood, message, active }) {
  const moodRef = useRef(mood);
  const spinRef = useRef(null);
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

  // entrance
  useEffect(() => {
    if (!active || !wrapRef.current) return;
    gsap.fromTo(
      wrapRef.current,
      { y: 120, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.4)", delay: 0.4 }
    );
  }, [active]);

  // speech bubble pop on message change, then fade
  useEffect(() => {
    if (!active || !shown || !bubbleRef.current) return;
    const b = bubbleRef.current;
    clearTimeout(hideTimer.current);
    gsap.killTweensOf(b);
    gsap.fromTo(
      b,
      { opacity: 0, y: 12, scale: 0.85, transformOrigin: "bottom right" },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.8)" }
    );
    hideTimer.current = setTimeout(() => {
      gsap.to(b, { opacity: 0, y: 8, duration: 0.4, ease: "power2.in" });
    }, 5200);
    return () => clearTimeout(hideTimer.current);
  }, [shown, active]);

  const onPoke = () => {
    spinRef.current = 0;
    const pool = guide.tips.filter((t) => t !== tip);
    setTip(pool[Math.floor(Math.random() * pool.length)]);
  };

  if (!active) return null;

  const mascot = <Mascot moodRef={moodRef} />;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed bottom-5 right-5 z-[80] opacity-0 md:bottom-8 md:right-8"
      aria-hidden
    >
      {/* speech bubble */}
      <div className="flex justify-end">
        <div
          ref={bubbleRef}
          className="guide-bubble mb-2 max-w-[230px] rounded-2xl rounded-br-sm px-4 py-3 opacity-0"
        >
          <p className="font-grotesk text-[13px] font-bold uppercase tracking-wide text-lime">
            {guide.name}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-paper/90">{shown}</p>
        </div>
      </div>
      {/* character canvas — the only clickable part, so content stays clickable */}
      <div
        className="pointer-events-auto relative ml-auto h-[150px] w-[150px] cursor-pointer md:h-[185px] md:w-[185px]"
        onClick={onPoke}
        data-hover
      >
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.1, 3.6], fov: 38 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[2.5, 3, 4]} intensity={1.6} />
          <directionalLight position={[-3, 1, 2]} intensity={0.35} color="#d7ff3e" />
          <FloatRig moodRef={moodRef} spinRef={spinRef}>
            <Suspense fallback={mascot}>
              <ModelBoundary fallback={mascot}>
                <UserModel />
              </ModelBoundary>
            </Suspense>
          </FloatRig>
        </Canvas>
        {/* soft shadow */}
        <div className="pointer-events-none absolute -bottom-1 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/50 blur-md" />
      </div>
    </div>
  );
}
