import type { ComparisonStepV2 } from "@tcg/protocol/animations";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion } from "motion/react";
import { createPortal } from "react-dom";

import { SimulatorEntityVisual, projectEntityVisual } from "../components/SimulatorEntityVisual";
import { useAnimationRuntime } from "../provider/contexts";
import { overlayPortalRoot } from "./overlay-utils";

export function ComparisonOverlay() {
  const runtime = useAnimationRuntime();
  if (typeof document === "undefined" || runtime.activeTransition?.phase !== "running") return null;

  const items = (runtime.compiledPlan?.steps ?? []).flatMap((compiled) => {
    const step = compiled.step;
    if (step.type !== "comparison") return [];
    const resolveParticipant = (participant: ComparisonStepV2["participants"][number]) => {
      const entity = runtime.getEntity(
        runtime.activeTransition!.toState,
        participant.entity.id,
        "public",
      );
      const fallback = participant.fallbackPresentation;
      const identityZone = fallback?.identityZone;
      const identityEntityId = identityZone
        ? runtime.getZone(runtime.activeTransition!.toState, identityZone)?.entityIds[0]
        : undefined;
      return {
        ...participant,
        entity: entity
          ? projectEntityVisual(entity, "public")
          : fallback
            ? {
                id: participant.entity.id,
                title: participant.label,
                subtitle: "Revealed card",
                kind: "card" as const,
                ownerId: fallback.ownerId,
                face: "public" as const,
                states: [],
                stats: [],
                traits: [],
                ...(fallback.canonicalId
                  ? { dataAttributes: { "data-fab-canonical-id": fallback.canonicalId } }
                  : {}),
              }
            : null,
        identity: identityEntityId
          ? runtime.getEntity(runtime.activeTransition!.toState, identityEntityId, "public")
          : null,
      };
    };
    const first = resolveParticipant(step.participants[0]);
    const second = resolveParticipant(step.participants[1]);
    return [{ compiled, step, participants: [first, second] }];
  });
  if (items.length === 0) return null;

  return createPortal(
    overlayPortalRoot(
      items.map(({ compiled, step, participants }) => (
        <ComparisonVisual
          key={step.id}
          step={step}
          participants={participants}
          viewerSeatId={runtime.viewerSeatId}
          delaySeconds={compiled.startAtMs / 1_000}
          durationSeconds={compiled.durationMs / 1_000}
        />
      )),
    ),
    document.body,
  );
}

function ComparisonVisual({
  step,
  participants,
  viewerSeatId,
  delaySeconds,
  durationSeconds,
}: {
  readonly step: ComparisonStepV2;
  readonly participants: readonly {
    readonly entity: SimulatorEntity | null;
    readonly label: string;
    readonly valueLabel: string;
    readonly tone: "winner" | "loser" | "neutral";
    readonly identity: SimulatorEntity | null;
  }[];
  readonly viewerSeatId: string | null;
  readonly delaySeconds: number;
  readonly durationSeconds: number;
}) {
  const resultDelay = delaySeconds + durationSeconds * 0.42;
  const tabletopBounds = document
    .querySelector<HTMLElement>('[data-active-shell="true"] > [data-simulator-tabletop="true"]')
    ?.getBoundingClientRect();
  return (
    <motion.div
      data-animation-overlay="comparison"
      data-animation-comparison-result={step.resultLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ delay: delaySeconds, duration: durationSeconds, times: [0, 0.12, 0.84, 1] }}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: tabletopBounds?.left ?? 0,
        width: tabletopBounds?.width ?? "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gap: 14,
          maxWidth: "calc(100vw - 24px)",
          padding: "16px clamp(16px, 3vw, 28px) 18px",
          border: "1px solid rgba(246, 223, 160, 0.22)",
          borderRadius: 16,
          background: "rgba(28, 14, 16, 0.94)",
          boxShadow: "0 18px 48px rgba(0, 0, 0, 0.42)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, transform: "translate3d(0, -8px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ delay: delaySeconds + 0.08, duration: 0.2 }}
          style={{ color: "#f6dfa0", fontSize: 13, fontWeight: 900, letterSpacing: "0.16em" }}
        >
          {step.title}
        </motion.div>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 5vw, 54px)" }}>
          {participants.map((participant, index) => {
            const won = participant.tone === "winner";
            const lost = participant.tone === "loser";
            const isViewer = participant.entity?.ownerId === viewerSeatId;
            const seatLabel = isViewer ? "YOU" : "OPPONENT";
            const seatColor = isViewer ? "#70b7ff" : "#ef7378";
            const heroTitle = participant.identity?.title ?? "Hero unavailable";
            return (
              <motion.div
                key={step.participants[index]!.entity.id}
                data-animation-comparison-participant={participant.tone}
                initial={{
                  opacity: 0,
                  transform: `translate3d(${index === 0 ? -18 : 18}px, 8px, 0) scale(0.94)`,
                }}
                animate={{
                  opacity: [0, 1, 1, 1],
                  transform: [
                    `translate3d(${index === 0 ? -18 : 18}px, 8px, 0) scale(0.94)`,
                    "translate3d(0, 0, 0) scale(1)",
                    "translate3d(0, 0, 0) scale(1)",
                  ],
                }}
                transition={{
                  delay: delaySeconds + index * 0.06,
                  duration: durationSeconds * 0.62,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.46, 1],
                }}
                style={{ display: "grid", justifyItems: "center", gap: 8 }}
              >
                <div
                  aria-label={`${seatLabel}: ${heroTitle}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: "clamp(126px, 18vw, 164px)",
                    maxWidth: "clamp(138px, 22vw, 192px)",
                    minHeight: 42,
                    padding: "4px 10px 4px 4px",
                    border: `1px solid ${seatColor}`,
                    borderRadius: 999,
                    background: isViewer ? "rgba(44, 105, 164, 0.22)" : "rgba(146, 48, 57, 0.22)",
                    color: "#fff6dd",
                    boxShadow: "0 5px 14px rgba(0, 0, 0, 0.22)",
                  }}
                >
                  {participant.identity ? (
                    <div
                      aria-hidden="true"
                      style={{
                        width: 32,
                        aspectRatio: "1",
                        overflow: "hidden",
                        flex: "0 0 auto",
                        border: `1px solid ${seatColor}`,
                        borderRadius: 5,
                        boxShadow: "0 3px 9px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      <SimulatorEntityVisual entity={participant.identity} density="compact" />
                    </div>
                  ) : null}
                  <div
                    style={{
                      display: "grid",
                      minWidth: 0,
                      gap: 2,
                      lineHeight: 1,
                    }}
                  >
                    <span
                      style={{
                        color: seatColor,
                        fontSize: 9,
                        fontWeight: 950,
                        letterSpacing: "0.13em",
                      }}
                    >
                      {seatLabel}
                    </span>
                    <span
                      title={heroTitle}
                      style={{
                        overflow: "hidden",
                        color: "#fff6dd",
                        fontSize: 10,
                        fontWeight: 750,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heroTitle}
                    </span>
                  </div>
                </div>
                <motion.div
                  initial={{ transform: "translate3d(0, 0, 0) scale(1)" }}
                  animate={{
                    transform: `translate3d(0, 0, 0) scale(${won ? 1.1 : lost ? 0.9 : 1})`,
                  }}
                  transition={{
                    delay: resultDelay,
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    width: "clamp(92px, 12vw, 132px)",
                    aspectRatio: "1 / 1",
                    boxSizing: "border-box",
                    border: "2px solid",
                    borderColor: won ? "#e1b94f" : lost ? "#8f3f45" : "rgba(246, 223, 160, 0.28)",
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: won
                      ? "0 16px 38px rgba(210, 168, 63, 0.42)"
                      : "0 10px 24px rgba(0, 0, 0, 0.42)",
                  }}
                >
                  {participant.entity ? (
                    <SimulatorEntityVisual entity={participant.entity} density="normal" />
                  ) : (
                    <div
                      data-animation-comparison-fallback=""
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        padding: 12,
                        background: "linear-gradient(145deg, #3a2022, #13090a 72%)",
                        color: "#f6dfa0",
                        fontSize: 11,
                        fontWeight: 900,
                        textAlign: "center",
                      }}
                    >
                      {participant.label}
                    </div>
                  )}
                </motion.div>
                <div
                  style={{
                    maxWidth: 170,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 750,
                    textAlign: "center",
                  }}
                >
                  {participant.label}
                </div>
                <div style={{ color: won ? "#f6dfa0" : "#e8d8d1", fontSize: 16, fontWeight: 950 }}>
                  {participant.valueLabel}
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0, transform: "translate3d(0, 8px, 0) scale(0.94)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            transform: [
              "translate3d(0, 8px, 0) scale(0.94)",
              "translate3d(0, 0, 0) scale(1)",
              "translate3d(0, 0, 0) scale(1)",
              "translate3d(0, -4px, 0) scale(1)",
            ],
          }}
          transition={{
            delay: resultDelay,
            duration: durationSeconds * 0.52,
            times: [0, 0.2, 0.78, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            minHeight: 34,
            display: "grid",
            placeItems: "center",
            padding: "7px 16px",
            borderRadius: 999,
            background: "#281416",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.36)",
            color: "#fff6dd",
            fontSize: 14,
            fontWeight: 950,
          }}
        >
          {step.resultLabel}
        </motion.div>
      </div>
    </motion.div>
  );
}
