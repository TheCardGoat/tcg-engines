import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { Group, Mesh, MeshBasicMaterial, QuadraticBezierCurve3, Vector3 } from "three";
import type { EffectArrowProps } from "@tcg/simulator-ui";
import { useEngine, PLAYER_SIDE_TO_ID } from "../engine";
import { SimulatorEffectCanvas } from "@tcg/simulator-presentation/canvas";

export const DATA_STREAM_COLORS = {
  local: "#67d9f5",
  rival: "#ff7b82",
  unknown: "#a9bec8",
} as const;
export interface DataStreamConnection extends EffectArrowProps {
  color: string;
  sustained?: boolean;
}

export function ProgramDataStreams({
  connections,
  playbackStartedAtMs,
}: {
  connections: readonly EffectArrowProps[];
  playbackStartedAtMs?: number;
}) {
  const { matchState, humanSide } = useEngine();
  return (
    <DataStreams
      playbackStartedAtMs={playbackStartedAtMs}
      connections={connections.map((connection) => {
        const id = connection.sourceId?.replace(/^resolving-program:/, "");
        const owner = id ? matchState.G.cardIndex[id]?.ownerId : undefined;
        return {
          ...connection,
          color:
            owner === undefined
              ? DATA_STREAM_COLORS.unknown
              : owner === PLAYER_SIDE_TO_ID[humanSide]
                ? DATA_STREAM_COLORS.local
                : DATA_STREAM_COLORS.rival,
        };
      })}
    />
  );
}

export function DataStreams({
  connections,
  playbackStartedAtMs,
}: {
  connections: readonly DataStreamConnection[];
  playbackStartedAtMs?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <div
      data-data-stream-targeting=""
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <SimulatorEffectCanvas active={connections.length > 0}>
        {connections.map((connection) => (
          <Stream
            key={connection.id}
            connection={connection}
            playbackStartedAtMs={playbackStartedAtMs}
            reducedMotion={reducedMotion}
          />
        ))}
      </SimulatorEffectCanvas>
    </div>
  );
}

function Stream({
  connection: c,
  playbackStartedAtMs,
  reducedMotion,
}: {
  connection: DataStreamConnection;
  playbackStartedAtMs?: number;
  reducedMotion: boolean;
}) {
  const { size } = useThree();
  const root = useRef<Group>(null);
  const packets = useRef<Group>(null);
  const reticle = useRef<Group>(null);
  const born = useRef(performance.now());
  const point = useMemo(() => new Vector3(), []);
  const curve = useMemo(() => {
    const a = new Vector3(c.source.x - size.width / 2, size.height / 2 - c.source.y, 0);
    const b = new Vector3(c.destination.x - size.width / 2, size.height / 2 - c.destination.y, 0);
    const mid = a.clone().lerp(b, 0.5);
    mid.x -= Math.min(45, a.distanceTo(b) * 0.12);
    mid.y += Math.min(45, a.distanceTo(b) * 0.12);
    return new QuadraticBezierCurve3(a, mid, b);
  }, [c.source.x, c.source.y, c.destination.x, c.destination.y, size.width, size.height]);
  useFrame(() => {
    const elapsed = performance.now() - (playbackStartedAtMs ?? born.current) - c.startAtMs;
    const progress = elapsed / Math.max(1, c.durationMs);
    const active = c.sustained || (progress >= 0 && progress <= 1);
    if (root.current) root.current.visible = Boolean(active);
    packets.current?.children.forEach((child, i) => {
      const u = c.sustained ? (elapsed / 1600 + i / 7) % 1 : progress / 0.65 - i * 0.045;
      child.visible = !reducedMotion && u >= 0 && u <= 1;
      curve.getPoint(Math.max(0, Math.min(1, u)), point);
      child.position.copy(point);
      const tangent = curve.getTangent(Math.max(0, Math.min(1, u)));
      child.rotation.z = Math.atan2(tangent.y, tangent.x);
    });
    if (reticle.current) {
      const impact = c.sustained || reducedMotion ? 0 : Math.max(0, (progress - 0.65) / 0.35);
      reticle.current.scale.setScalar(1 + impact * 0.7);
      reticle.current.rotation.z = reducedMotion ? 0 : elapsed / 4500;
      reticle.current.children.forEach((child) => {
        if (child instanceof Mesh && child.material instanceof MeshBasicMaterial)
          child.material.opacity = c.sustained ? 0.55 : progress < 0.65 ? 0.25 : 0.9 * (1 - impact);
      });
    }
  });
  return (
    <group ref={root}>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.65, 4, false]} />
        <meshBasicMaterial color={c.color} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 48, 2.1, 4, false]} />
        <meshBasicMaterial color={c.color} transparent opacity={0.045} depthWrite={false} />
      </mesh>
      <group ref={packets}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i}>
            <planeGeometry args={[6, 2.8]} />
            <meshBasicMaterial
              color={c.color}
              transparent
              opacity={1 - i * 0.07}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={reticle} position={curve.v2}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i}>
            <ringGeometry args={[20, 21.5, 8, 1, (i * Math.PI) / 4, 0.48]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.55} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
