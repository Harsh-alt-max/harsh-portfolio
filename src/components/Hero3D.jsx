import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const pointer = { x: 0, y: 0 };

function Particles({ count = 1100 }) {
  const ref = useRef();
  const base = useRef(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lime = new THREE.Color("#d7ff3e");
    const white = new THREE.Color("#8f8f96");
    const dim = new THREE.Color("#3a3a42");
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 6;
      const c = Math.random();
      const col = c > 0.93 ? lime : c > 0.6 ? white : dim;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    // gentle wave: displace each particle's Y from its rest position
    if (!base.current) base.current = positions.slice();
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array;
    const src = base.current;
    for (let i = 0; i < count; i++) {
      const x = src[i * 3];
      const z = src[i * 3 + 2];
      arr[i * 3 + 1] =
        src[i * 3 + 1] +
        Math.sin(t * 0.55 + x * 0.16) * 0.38 +
        Math.cos(t * 0.42 + z * 0.13) * 0.38;
    }
    pos.needsUpdate = true;
    // camera drifts toward the pointer
    state.camera.position.x += (pointer.x * 1.6 - state.camera.position.x) * 0.03;
    state.camera.position.y += (pointer.y * 0.9 + 0.5 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, -4);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function Floaters() {
  const g1 = useRef();
  const g2 = useRef();
  const g3 = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g1.current) {
      g1.current.rotation.x = t * 0.12;
      g1.current.rotation.y = t * 0.16;
      g1.current.position.y = Math.sin(t * 0.5) * 0.5 + 1;
    }
    if (g2.current) {
      g2.current.rotation.x = -t * 0.1;
      g2.current.rotation.z = t * 0.14;
      g2.current.position.y = Math.cos(t * 0.4) * 0.6 - 1.2;
    }
    if (g3.current) {
      g3.current.rotation.y = t * 0.2;
      g3.current.position.y = Math.sin(t * 0.6 + 2) * 0.4 + 2.4;
    }
  });
  return (
    <>
      <mesh ref={g1} position={[5.5, 1, -5]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#d7ff3e" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh ref={g2} position={[-6, -1.2, -6]}>
        <torusGeometry args={[1, 0.28, 12, 28]} />
        <meshBasicMaterial color="#8f8f96" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh ref={g3} position={[-4.5, 2.4, -7]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#d7ff3e" wireframe transparent opacity={0.12} />
      </mesh>
    </>
  );
}

/** Full-hero 3D backdrop: undulating particle wave field + floating wireframes, mouse-reactive. */
export default function Hero3D() {
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // pause rendering when the tab is hidden — saves battery
    const onVis = () => setVisible(!document.hidden);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.5, 8], fov: 55 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#0b0b0c", 9, 22]} />
        <Particles count={coarse ? 500 : 1100} />
        <Floaters />
      </Canvas>
      {/* vignette to keep type readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0b0b0c_92%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0b0c] to-transparent" />
    </div>
  );
}
