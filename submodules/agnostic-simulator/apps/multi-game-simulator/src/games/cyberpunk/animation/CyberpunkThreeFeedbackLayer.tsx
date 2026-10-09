import { useFrame, useThree } from "@react-three/fiber";
import type { PhaseChangeStepV2, ValueDeltaStepV2 } from "@tcg/protocol";
import { useAnimationRuntime } from "@tcg/simulator-ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mesh, MeshBasicMaterial } from "three";
import { useEngine } from "../engine";
import { cyberpunkZoneAnchorId } from "../engine/projectSimulator";
import { PLAYER_SIDE_TO_ID } from "../engine/sides";
import { useAnimationSurfaceFrame } from "./animationSurfaceFrame";
import { SimulatorEffectCanvas } from "@tcg/simulator-presentation/canvas";
import classes from "./CyberpunkThreeFeedbackLayer.module.css";

interface PhaseFeedback {
  readonly id: string;
  readonly step: PhaseChangeStepV2;
  readonly startAtMs: number;
  readonly durationMs: number;
}

interface PhasePresentation {
  readonly transitionId: string;
  readonly phases: readonly PhaseFeedback[];
  readonly playbackStartedAtMs: number;
  readonly expiresAtMs: number;
}

interface ValueFeedback {
  readonly id: string;
  readonly step: ValueDeltaStepV2;
  readonly startAtMs: number;
  readonly durationMs: number;
}

interface BoardDivider {
  readonly x: number;
  readonly y: number;
}

export function CyberpunkThreeFeedbackLayer({
  enablePhaseSweep,
}: {
  readonly enablePhaseSweep: boolean;
}) {
  const runtime = useAnimationRuntime();
  const frame = useAnimationSurfaceFrame();
  if (typeof document === "undefined") return null;
  const steps =
    runtime.activeTransition?.phase === "running" ? (runtime.compiledPlan?.steps ?? []) : [];

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
  const values = steps.flatMap<ValueFeedback>((compiled) =>
    compiled.step.type === "valueDelta" && compiled.durationMs > 0
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
  const [phasePresentation, setPhasePresentation] = useState<PhasePresentation | null>(null);
  const [boardDivider, setBoardDivider] = useState<BoardDivider | null>(null);
  const capturedPhaseTransitionId = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!enablePhaseSweep || phases.length === 0 || runtime.activeTransition?.phase !== "running") {
      return;
    }
    const transitionId = runtime.activeTransition.id;
    if (capturedPhaseTransitionId.current === transitionId) return;
    capturedPhaseTransitionId.current = transitionId;
    const playbackStartedAtMs = runtime.playbackStartedAtMs ?? performance.now();
    setPhasePresentation({
      transitionId,
      phases,
      playbackStartedAtMs,
      expiresAtMs:
        playbackStartedAtMs + Math.max(...phases.map((item) => item.startAtMs + item.durationMs)),
    });
  }, [enablePhaseSweep, phases, runtime.activeTransition, runtime.playbackStartedAtMs]);

  useEffect(() => {
    if (!phasePresentation) return;
    const timer = window.setTimeout(
      () =>
        setPhasePresentation((current) =>
          current?.transitionId === phasePresentation.transitionId ? null : current,
        ),
      Math.max(0, phasePresentation.expiresAtMs - performance.now()),
    );
    return () => window.clearTimeout(timer);
  }, [phasePresentation]);

  const visiblePhases = enablePhaseSweep ? (phasePresentation?.phases ?? []) : phases;
  const active = enablePhaseSweep && visiblePhases.length > 0;

  useLayoutEffect(() => {
    if (!active) return;
    const rivalField = document.querySelector<HTMLElement>('[data-sim-zone-id="opp-field"]');
    const playerField = document.querySelector<HTMLElement>('[data-sim-zone-id="p-field"]');
    if (!rivalField || !playerField) return;
    // Field rects are measured in viewport space; map them into the overlay's
    // frame so the divider sits between the rows on a rotated surface too.
    const rival = frame.mapRect(rivalField.getBoundingClientRect());
    const player = frame.mapRect(playerField.getBoundingClientRect());
    setBoardDivider({
      x: (rival.left + rival.right + player.left + player.right) / 4,
      y: (rival.bottom + player.top) / 2,
    });
  }, [active, phasePresentation?.transitionId, frame]);

  return createPortal(
    <div
      aria-hidden
      data-three-feedback-layer={active ? "" : undefined}
      style={{
        position: frame.surface ? "absolute" : "fixed",
        inset: 0,
        zIndex: 1002,
        pointerEvents: "none",
      }}
    >
      {enablePhaseSweep ? (
        <>
          <SimulatorEffectCanvas active={active}>
            {visiblePhases.map((item) => (
              <PhaseSweep
                key={item.id}
                item={item}
                playbackStartedAtMs={phasePresentation?.playbackStartedAtMs}
                boardDivider={boardDivider}
              />
            ))}
          </SimulatorEffectCanvas>
          {visiblePhases
            .filter((item) => item.step.variant === "turn")
            .map((item) => (
              <div
                key={item.id}
                className={classes.turnBanner}
                data-turn-banner={item.step.turnNumber ?? "next"}
                style={{
                  ...(boardDivider && { left: boardDivider.x, top: boardDivider.y }),
                  animationDelay: `${item.startAtMs - (performance.now() - (phasePresentation?.playbackStartedAtMs ?? performance.now()))}ms`,
                  animationDuration: `${item.durationMs}ms`,
                }}
              >
                {item.step.turnNumber === undefined ? (
                  <strong>Next Turn</strong>
                ) : (
                  <>
                    <span>Turn</span>
                    <strong>{item.step.turnNumber}</strong>
                  </>
                )}
              </div>
            ))}
        </>
      ) : (
        phases.map((item) => (
          <div
            key={item.id}
            className={classes.phaseSweep}
            style={{
              animationDelay: `${item.startAtMs}ms`,
              animationDuration: `${item.durationMs}ms`,
            }}
          />
        ))
      )}
      {values.map((item) => (
        <ValuePulse key={item.id} item={item} />
      ))}
    </div>,
    frame.surface ?? document.body,
  );
}

function ValuePulse({ item }: { readonly item: ValueFeedback }) {
  const { humanSide } = useEngine();
  const frame = useAnimationSurfaceFrame();
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const attribute = item.step.subject.kind === "zone" ? "data-sim-zone-id" : "data-sim-entity-id";
    const ownerSide =
      item.step.subject.kind === "zone" &&
      item.step.subject.ownerId === String(PLAYER_SIDE_TO_ID.player)
        ? "player"
        : "opponent";
    const anchorId =
      item.step.subject.kind === "zone" && item.step.subject.id === "eddieArea"
        ? cyberpunkZoneAnchorId("eddieArea", ownerSide)
        : item.step.subject.id;
    let anchor = [...document.querySelectorAll<HTMLElement>(`[${attribute}]`)].find(
      (node) => node.getAttribute(attribute) === anchorId && node.getClientRects().length > 0,
    );
    if (
      !anchor &&
      item.step.subject.kind === "zone" &&
      item.step.subject.id.endsWith("eddieArea")
    ) {
      const side = ownerSide === humanSide ? "player" : "rival";
      anchor =
        document.querySelector<HTMLElement>(
          `[data-testid="${side}-zone-summary-bar"] [data-zone-summary-eddies]`,
        ) ?? undefined;
    }
    if (!anchor) return;
    const rect = frame.mapRect(anchor.getBoundingClientRect());
    setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [frame, humanSide, item.step.subject]);
  if (!center) return null;
  return (
    <div
      aria-hidden="true"
      className={classes.valuePulse}
      data-value-pulse={item.step.delta < 0 ? "spend" : "gain"}
      style={{
        left: center.x,
        top: center.y,
        animationDelay: `${item.startAtMs}ms`,
        animationDuration: `${item.durationMs}ms`,
      }}
    />
  );
}

function PhaseSweep({
  item,
  playbackStartedAtMs,
  boardDivider,
}: {
  readonly item: PhaseFeedback;
  readonly playbackStartedAtMs?: number;
  readonly boardDivider: BoardDivider | null;
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
    <mesh
      ref={line}
      position={[
        0,
        item.step.variant === "turn" && boardDivider ? size.height / 2 - boardDivider.y : 0,
        0,
      ]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={0x65e3e7} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function timelineProgress(
  item: Pick<PhaseFeedback, "startAtMs" | "durationMs">,
  playbackStartedAtMs: number | undefined,
): number {
  return clamp01(
    (performance.now() - (playbackStartedAtMs ?? performance.now()) - item.startAtMs) /
      Math.max(1, item.durationMs),
  );
}

function smoothStep(value: number): number {
  return value * value * (3 - 2 * value);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
