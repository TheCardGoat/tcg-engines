import { motion } from "motion/react";
import type { AnimationRef } from "@tcg/protocol/animations";
import { createPortal } from "react-dom";
import { useLayoutEffect, useState } from "react";

import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import type { AnimationNodeRegistry } from "../lib/node-registry";
import { useAnimationRuntime } from "../provider/contexts";
import { centerForRef, overlayPortalRoot } from "./overlay-utils";

export function CombatOverlay() {
  const runtime = useAnimationRuntime();
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
      <svg width="100%" height="100%">
        {items.map(({ compiled, source, target }) => {
          if (compiled.step.type !== "combat") return null;
          const style = combatOverlayStyle(compiled.step.reason);
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
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={style.color}
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                strokeLinecap="round"
              />
              <circle cx={target.x} cy={target.y} r={style.targetRadius} fill={style.color} />
              <text
                x={(source.x + target.x) / 2}
                y={(source.y + target.y) / 2 - 12}
                fill={style.color}
                textAnchor="middle"
                fontSize="13"
                fontWeight="900"
                letterSpacing="0.08em"
                paintOrder="stroke"
                stroke="rgba(7, 8, 10, 0.88)"
                strokeWidth="4"
              >
                {label}
              </text>
            </motion.g>
          );
        })}
      </svg>,
    ),
    document.body,
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
  return centerForRef(registry, ref, useOutgoingGeometry ? "exiting" : undefined);
}
