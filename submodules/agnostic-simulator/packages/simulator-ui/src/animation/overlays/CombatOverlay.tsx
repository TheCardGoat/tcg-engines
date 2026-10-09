import { motion, useReducedMotion } from "motion/react";
import type { AnimationRef } from "@tcg/protocol/animations";
import { createPortal } from "react-dom";
import { useContext, useLayoutEffect, useState } from "react";

import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import type { AnimationNodeRegistry } from "../lib/node-registry";
import { useAnimationRuntime } from "../provider/contexts";
import { EffectConnectionsContext } from "./EffectOverlay";
import { centerForRef, overlayPortalRoot } from "./overlay-utils";

export function CombatOverlay() {
  const runtime = useAnimationRuntime();
  const Connections = useContext(EffectConnectionsContext);
  const reduceMotion = useReducedMotion();
  useAnimationRegistryVersion(runtime.registry);
  const [, setViewportGeometryVersion] = useState(0);
  const activeCombatTransitionId =
    runtime.activeTransition?.phase === "running" &&
    runtime.compiledPlan?.steps.some(({ step }) => step.type === "combat")
      ? runtime.activeTransition.id
      : null;

  useLayoutEffect(() => {
    if (!activeCombatTransitionId) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setViewportGeometryVersion((version) => version + 1);
      });
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [activeCombatTransitionId]);

  // Transfer clones mount one commit after the presentation swap, and a held
  // clone only starts moving at its own beat. Track the live geometry so the
  // combat lines and status pills anchor on the clone instead of a stale zone.
  useLayoutEffect(() => {
    if (!activeCombatTransitionId) return;
    let frame = 0;
    const tick = () => {
      setViewportGeometryVersion((version) => version + 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeCombatTransitionId]);

  // The fight result should land physically: jolt both participants at the
  // impact moment so the board reads as a collision, not just a drawn line.
  useLayoutEffect(() => {
    if (!activeCombatTransitionId || reduceMotion) return;
    const impacts = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
      if (compiled.step.type !== "combat" || compiled.step.reason !== "resolved") return [];
      return [
        {
          atMs: compiled.startAtMs + compiled.durationMs * 0.5,
          entityIds: [compiled.step.source.id, compiled.step.target.id],
        },
      ];
    });
    if (impacts.length === 0) return;
    const timers = impacts.map(({ atMs, entityIds }) =>
      window.setTimeout(
        () => {
          for (const entityId of entityIds) shakeCombatParticipant(entityId);
        },
        Math.max(0, atMs),
      ),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [activeCombatTransitionId, reduceMotion, runtime.compiledPlan]);

  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;
  const compiledSteps = runtime.compiledPlan?.steps ?? [];
  const transferringEntityIds = new Set(
    compiledSteps.flatMap(({ step }) => (step.type === "entityTransfer" ? [step.entity.id] : [])),
  );
  const items = compiledSteps.flatMap((compiled) => {
    if (compiled.step.type !== "combat") return [];
    const source = centerForCombatRef(
      runtime.registry,
      compiled.step.source,
      transferringEntityIds,
    );
    const target = centerForCombatRef(
      runtime.registry,
      compiled.step.target,
      transferringEntityIds,
    );
    return source && target ? [{ compiled, source, target }] : [];
  });
  if (items.length === 0) return null;
  return createPortal(
    overlayPortalRoot(
      <>
        {Connections ? (
          <Connections
            playbackStartedAtMs={runtime.playbackStartedAtMs ?? undefined}
            connections={items.flatMap(({ compiled, source, target }) =>
              compiled.step.type === "combat"
                ? [
                    {
                      id: compiled.step.id,
                      source,
                      destination: target,
                      sourceId: compiled.step.source.id,
                      startAtMs: compiled.startAtMs,
                      durationMs: compiled.durationMs,
                    },
                  ]
                : [],
            )}
          />
        ) : (
          <svg width="100%" height="100%">
            {items.map(({ compiled, source, target }) => {
              if (compiled.step.type !== "combat") return null;
              const style = combatOverlayStyle(compiled.step.reason);
              const presentation = combatOverlayPresentation(
                window.innerWidth,
                source,
                target,
                style,
              );
              const label = compiled.step.label ?? style.label;
              return (
                <motion.g
                  key={compiled.step.id}
                  data-animation-overlay="combat"
                  data-combat-reason={compiled.step.reason ?? "declared"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay: compiled.startAtMs / 1_000,
                    duration: compiled.durationMs / 1_000,
                    times: [0, 0.12, 0.78, 1],
                  }}
                >
                  <motion.line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={style.color}
                    strokeWidth={presentation.lineWidth}
                    strokeDasharray={style.dash}
                    strokeLinecap="round"
                    initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 0.82] }}
                    transition={{
                      delay: compiled.startAtMs / 1_000,
                      duration: (compiled.durationMs * 0.58) / 1_000,
                      times: [0, 0.28, 1],
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  <circle
                    cx={target.x}
                    cy={target.y}
                    r={presentation.targetRadius}
                    fill={style.color}
                  />
                  {compiled.step.showText === false ? null : (
                    <text
                      data-animation-label
                      x={presentation.label.x}
                      y={presentation.label.y}
                      fill={style.color}
                      textAnchor="middle"
                      fontSize={presentation.compact ? 11 : 13}
                      fontWeight="900"
                      letterSpacing="0.08em"
                      paintOrder="stroke"
                      stroke="rgba(7, 8, 10, 0.88)"
                      strokeWidth="4"
                    >
                      {label}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        )}
        {items.flatMap(({ compiled, source, target }) => {
          if (compiled.step.type !== "combat") return [];
          const style = combatOverlayStyle(compiled.step.reason);
          const presentation = combatOverlayPresentation(window.innerWidth, source, target, style);
          return [
            ...(compiled.step.sourceStatus
              ? [
                  <CombatStatusLabel
                    key={`${compiled.step.id}:source-status`}
                    x={source.x}
                    y={presentation.sourceStatusY}
                    status={compiled.step.sourceStatus}
                    compact={presentation.compact}
                    delay={compiled.startAtMs / 1_000}
                    duration={compiled.durationMs / 1_000}
                  />,
                ]
              : []),
            ...(compiled.step.targetStatus
              ? [
                  <CombatStatusLabel
                    key={`${compiled.step.id}:target-status`}
                    x={target.x}
                    y={presentation.targetStatusY}
                    status={compiled.step.targetStatus}
                    compact={presentation.compact}
                    delay={compiled.startAtMs / 1_000}
                    duration={compiled.durationMs / 1_000}
                  />,
                ]
              : []),
          ];
        })}
      </>,
    ),
    document.body,
  );
}

/**
 * Jolt a combat participant in place. Held transfer clones carry the attacker
 * mid-lane, so prefer the clone node and fall back to the mounted card.
 */
function shakeCombatParticipant(entityId: string) {
  const esc =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(entityId)
      : entityId;
  const node =
    document.querySelector<HTMLElement>(`[data-three-card-transfer-entity="${esc}"]`) ??
    document.querySelector<HTMLElement>(`[data-sim-entity-id="${esc}"]`);
  if (!node || typeof node.animate !== "function") return;
  try {
    node.animate(
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-6px)", offset: 0.18 },
        { transform: "translateX(5px)", offset: 0.38 },
        { transform: "translateX(-3px)", offset: 0.58 },
        { transform: "translateX(2px)", offset: 0.78 },
        { transform: "translateX(0px)" },
      ],
      { duration: 300, easing: "ease-out", composite: "add" },
    );
  } catch {
    // jsdom and other stubs: the board settles without the jolt.
  }
}

export function combatOverlayPresentation(
  viewportWidth: number,
  source: { readonly x: number; readonly y: number },
  target: { readonly x: number; readonly y: number },
  style: ReturnType<typeof combatOverlayStyle>,
) {
  const compact = viewportWidth <= 640;
  return {
    compact,
    lineWidth: style.width + (compact ? 1.5 : 0),
    targetRadius: style.targetRadius + (compact ? 3 : 0),
    sourceStatusY: source.y + (source.y >= target.y ? 64 : -64),
    targetStatusY: target.y + (target.y >= source.y ? 64 : -64),
    label: compact
      ? {
          x: target.x,
          y: target.y + (source.y >= target.y ? 36 : -28),
        }
      : {
          x: (source.x + target.x) / 2,
          y: (source.y + target.y) / 2 - 12,
        },
  };
}

function CombatStatusLabel({
  x,
  y,
  status,
  compact,
  delay,
  duration,
}: {
  readonly x: number;
  readonly y: number;
  readonly status: string;
  readonly compact: boolean;
  readonly delay: number;
  readonly duration: number;
}) {
  const fontSize = compact ? 9 : 11;
  const color = status.includes("PREVENTED")
    ? "#f6c453"
    : status.includes("DEFEATED") || status.includes("LOSES") || status.includes("LOST")
      ? "#ff7373"
      : status.includes("WINS") || status.includes("STEALS") || status.includes("BLOCKER")
        ? "#9af0b0"
        : "#ffffff";
  return (
    <motion.div
      data-combat-status={status}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ delay, duration, times: [0, 0.12, 0.78, 1] }}
      style={{
        position: "fixed",
        display: "block",
        zIndex: 10002,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        border: `1.5px solid ${color}`,
        borderRadius: 4,
        background: "rgba(7, 8, 10, 0.96)",
        color,
        padding: compact ? "3px 7px" : "4px 9px",
        fontSize,
        lineHeight: 1.2,
        fontWeight: 950,
        letterSpacing: "0.06em",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.65)",
      }}
    >
      {status}
    </motion.div>
  );
}

export function combatOverlayStyle(reason: "declared" | "blocked" | "resolved" | undefined) {
  switch (reason) {
    case "blocked":
      return { color: "#f6c453", width: 7, dash: "10 8", targetRadius: 9, label: "BLOCKED" };
    case "resolved":
      return { color: "#f04444", width: 6, dash: undefined, targetRadius: 11, label: "IMPACT" };
    case "declared":
    default:
      return {
        color: "var(--game-accent, #fb7185)",
        width: 5,
        dash: undefined,
        targetRadius: 7,
        label: "ATTACK",
      };
  }
}

function centerForCombatRef(
  registry: AnimationNodeRegistry,
  ref: AnimationRef | undefined,
  transferringEntityIds: ReadonlySet<string>,
) {
  const useOutgoingGeometry = ref?.kind === "entity" && transferringEntityIds.has(ref.id);
  if (useOutgoingGeometry && ref) {
    // A held transfer parks its clone at the source until the step starts; the
    // real node is already unmounted, so anchor on the clone before falling
    // back to the last known exiting geometry (or a zone anchor).
    const cloneCenter = centerForTransferClone(ref.id);
    if (cloneCenter) return cloneCenter;
  }
  return centerForRef(registry, ref, useOutgoingGeometry ? "exiting" : undefined);
}

function centerForTransferClone(entityId: string): { x: number; y: number } | null {
  const node = document.querySelector<HTMLElement>(
    `[data-three-card-transfer-entity="${entityId}"], [data-animation-transfer-entity="${entityId}"]`,
  );
  const rect = node?.getBoundingClientRect();
  return rect && rect.width > 0 && rect.height > 0
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    : null;
}
