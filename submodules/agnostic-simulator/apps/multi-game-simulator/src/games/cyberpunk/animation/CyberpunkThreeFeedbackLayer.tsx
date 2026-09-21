import { useFrame, useThree } from "@react-three/fiber";
import type { AnimationRef, PhaseChangeStepV2, ValueDeltaStepV2 } from "@tcg/protocol";
import { useAnimationRuntime } from "@tcg/simulator-ui";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Group, Mesh, MeshBasicMaterial } from "three";
import { CyberpunkEffectCanvas } from "./CyberpunkEffectCanvas";

interface ValueFeedback {
  readonly id: string;
  readonly step: ValueDeltaStepV2;
  readonly center: { readonly x: number; readonly y: number };
  readonly startAtMs: number;
  readonly durationMs: number;
}

interface PhaseFeedback {
  readonly id: string;
  readonly step: PhaseChangeStepV2;
  readonly startAtMs: number;
  readonly durationMs: number;
}

export function CyberpunkThreeFeedbackLayer() {
  const runtime = useAnimationRuntime();
  if (typeof document === "undefined") return null;
  const steps =
    runtime.activeTransition?.phase === "running" ? (runtime.compiledPlan?.steps ?? []) : [];

  const values = steps.flatMap<ValueFeedback>((compiled) => {
    if (compiled.step.type !== "valueDelta") return [];
    const center = centerForRef(runtime.registry, compiled.step.subject);
    return center
      ? [
          {
            id: compiled.step.id,
            step: compiled.step,
            center,
            startAtMs: compiled.startAtMs,
            durationMs: compiled.durationMs,
          },
        ]
      : [];
  });
  const phases = steps.flatMap<PhaseFeedback>((compiled) =>
    compiled.step.type === "phaseChange"
      ? [
          {
            id: compiled.step.id,
            step: compiled.step,
            startAtMs: compiled.startAtMs,
            durationMs: compiled.durationMs,
          },
        ]
      : [],
  );
  const active = values.length > 0 || phases.length > 0;

  return createPortal(
    <div
      aria-hidden
      data-three-feedback-layer={active ? "" : undefined}
      style={{ position: "fixed", inset: 0, zIndex: 1002, pointerEvents: "none" }}
    >
      <CyberpunkEffectCanvas active={active}>
        {values.map((item) => (
          <ValuePulse key={item.id} item={item} playbackStartedAtMs={runtime.playbackStartedAtMs} />
        ))}
        {phases.map((item) => (
          <PhaseSweep key={item.id} item={item} playbackStartedAtMs={runtime.playbackStartedAtMs} />
        ))}
      </CyberpunkEffectCanvas>
      {values.map((item) => (
        <ValueLabel key={item.id} item={item} playbackStartedAtMs={runtime.playbackStartedAtMs} />
      ))}
      {phases.map((item) => (
        <PhaseLabel key={item.id} item={item} playbackStartedAtMs={runtime.playbackStartedAtMs} />
      ))}
    </div>,
    document.body,
  );
}

function ValuePulse({
  item,
  playbackStartedAtMs,
}: {
  readonly item: ValueFeedback;
  readonly playbackStartedAtMs?: number;
}) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const { size } = useThree();
  useFrame(() => {
    const progress = timelineProgress(item, playbackStartedAtMs);
    if (group.current) {
      group.current.position.set(
        item.center.x - size.width / 2,
        size.height / 2 - item.center.y,
        0,
      );
      group.current.scale.setScalar(24 + smoothStep(progress) * 46);
    }
    const material = ring.current?.material;
    if (material instanceof MeshBasicMaterial) {
      material.opacity = Math.sin(Math.PI * progress) * 0.42;
    }
  });
  return (
    <group ref={group}>
      <mesh ref={ring}>
        <ringGeometry args={[0.78, 1, 48]} />
        <meshBasicMaterial
          color={item.step.delta < 0 ? 0xff536b : 0x65e3e7}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PhaseSweep({
  item,
  playbackStartedAtMs,
}: {
  readonly item: PhaseFeedback;
  readonly playbackStartedAtMs?: number;
}) {
  const line = useRef<Mesh>(null);
  const { size } = useThree();
  useFrame(() => {
    const progress = timelineProgress(item, playbackStartedAtMs);
    const material = line.current?.material;
    if (line.current) {
      line.current.scale.set(size.width * smoothStep(Math.min(1, progress * 3)), 2, 1);
    }
    if (material instanceof MeshBasicMaterial) {
      material.opacity = Math.sin(Math.PI * progress) * 0.5;
    }
  });
  return (
    <mesh ref={line}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={0x65e3e7} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function ValueLabel({
  item,
  playbackStartedAtMs,
}: {
  readonly item: ValueFeedback;
  readonly playbackStartedAtMs?: number;
}) {
  const label = useRef<HTMLDivElement>(null);
  useTimelineFrame(item, playbackStartedAtMs, (progress) => {
    if (!label.current) return;
    const opacity = Math.sin(Math.PI * progress);
    label.current.style.opacity = String(opacity);
    label.current.style.transform = `translate3d(-50%, ${8 - smoothStep(progress) * 48}px, 0) scale(${0.9 + Math.sin(Math.PI * progress) * 0.12})`;
  });
  return (
    <div
      ref={label}
      data-three-feedback="value-delta"
      style={{
        position: "fixed",
        left: item.center.x,
        top: item.center.y,
        color: item.step.delta < 0 ? "#ff8292" : "#72f4ef",
        fontSize: 18,
        fontWeight: 950,
        letterSpacing: ".06em",
        opacity: 0,
        textShadow: "0 2px 8px #02040a, 0 0 14px currentColor",
        whiteSpace: "nowrap",
      }}
    >
      {item.step.delta >= 0 ? "+" : ""}
      {item.step.delta} {item.step.label}
    </div>
  );
}

function PhaseLabel({
  item,
  playbackStartedAtMs,
}: {
  readonly item: PhaseFeedback;
  readonly playbackStartedAtMs?: number;
}) {
  const label = useRef<HTMLDivElement>(null);
  useTimelineFrame(item, playbackStartedAtMs, (progress) => {
    if (!label.current) return;
    const opacity = Math.min(1, progress * 8) * Math.min(1, (1 - progress) * 7);
    label.current.style.opacity = String(opacity);
    label.current.style.transform = `translate3d(-50%, ${12 - smoothStep(progress) * 18}px, 0) scale(${0.96 + Math.sin(Math.PI * progress) * 0.05})`;
  });
  return (
    <div
      ref={label}
      data-three-feedback="phase-change"
      style={{
        position: "fixed",
        left: "50%",
        top: "47%",
        padding: "10px 18px",
        border: "1px solid rgba(101, 227, 231, .72)",
        background: "rgba(4, 12, 20, .86)",
        color: "#e9ffff",
        fontSize: 15,
        fontWeight: 950,
        letterSpacing: ".16em",
        opacity: 0,
        boxShadow: "0 12px 36px rgba(0,0,0,.42), 0 0 22px rgba(101,227,231,.2)",
        whiteSpace: "nowrap",
      }}
    >
      {phaseTitle(item.step)}
    </div>
  );
}

function useTimelineFrame(
  item: Pick<ValueFeedback, "startAtMs" | "durationMs">,
  playbackStartedAtMs: number | undefined,
  update: (progress: number) => void,
) {
  const updateRef = useRef(update);
  updateRef.current = update;
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      updateRef.current(timelineProgress(item, playbackStartedAtMs));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [item, playbackStartedAtMs]);
}

function timelineProgress(
  item: Pick<ValueFeedback, "startAtMs" | "durationMs">,
  playbackStartedAtMs: number | undefined,
): number {
  return clamp01(
    (performance.now() - (playbackStartedAtMs ?? performance.now()) - item.startAtMs) /
      Math.max(1, item.durationMs),
  );
}

function centerForRef(
  registry: ReturnType<typeof useAnimationRuntime>["registry"],
  ref: AnimationRef,
): { x: number; y: number } | null {
  const node = registry.getPreferred(ref)?.node;
  if (!node) return null;
  const rect = node.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function phaseTitle(step: PhaseChangeStepV2): string {
  if (step.variant === "turn") return step.turnNumber ? `TURN ${step.turnNumber}` : "NEXT TURN";
  return step.to.replaceAll("-", " ").toUpperCase();
}

function smoothStep(value: number): number {
  return value * value * (3 - 2 * value);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
