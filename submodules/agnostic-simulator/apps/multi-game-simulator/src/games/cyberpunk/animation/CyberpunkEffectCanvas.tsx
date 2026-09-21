import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

/** Match-lifetime renderer; no continuous rendering while its effects are idle. */
export function CyberpunkEffectCanvas({
  active,
  children,
}: {
  readonly active: boolean;
  readonly children: ReactNode;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 500], near: 0.1, far: 1_000, zoom: 1 }}
      dpr={[1, 2]}
      frameloop={active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Keep the shared unlit transparent shader resident. The first idle
          render compiles it before a player action needs it; opacity zero
          preserves the transparent surface and does not write depth. */}
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {children}
    </Canvas>
  );
}
