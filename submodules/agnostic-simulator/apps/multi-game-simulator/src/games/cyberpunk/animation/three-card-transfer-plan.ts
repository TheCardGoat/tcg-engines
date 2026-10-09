import type { AnimationPlanV2, AnimationStepV2, EntityTransferStepV2 } from "@tcg/protocol";
import { CARD_TRANSFER_LANDING_PROGRESS } from "@tcg/simulator-presentation/motion";
import { UNIT_ENTRY_DURATION_MS, UNIT_ENTRY_CONTACT_PROGRESS } from "./unit-entry-motion";
import type { CompiledAnimationStep } from "@tcg/simulator-runtime/animation";

const DEFAULT_CARD_TRANSFER_DURATION_MS = 800;
/**
 * A public trash→hand retrieval (The Heist's recovered Gear and friends) is
 * the answer to "which card did I get?" — it earns a slower, staged flight.
 */
export const STAGED_RETRIEVAL_DURATION_MS = 2_000;
/** Fraction of that flight spent parked at the reveal display spot. */
export const STAGED_RETRIEVAL_VIA_HOLD = 0.45;

function isHandPlay(step: EntityTransferStepV2): boolean {
  return (
    step.from?.kind === "zone" &&
    step.from.id.endsWith("-hand") &&
    ((step.to?.kind === "zone" && step.to.id.endsWith("-field")) ||
      (step.to?.kind === "anchor" && step.to.id.startsWith("resolving-program:")))
  );
}

export function isUnitHandPlay(step: EntityTransferStepV2): boolean {
  return (
    step.from?.kind === "zone" &&
    step.from.id.endsWith("-hand") &&
    step.to?.kind === "zone" &&
    step.to.id.endsWith("-field")
  );
}

/** The field mesh takes over at contact while the flight copy fades out. */
export function cyberpunkEntityHandoffAtMs(entry: CompiledAnimationStep): number {
  return entry.step.type === "entityTransfer" && isUnitHandPlay(entry.step)
    ? entry.startAtMs + entry.durationMs * UNIT_ENTRY_CONTACT_PROGRESS
    : entry.endAtMs;
}

/**
 * A face-up card leaving the trash for a hand: the reveal already made the
 * identity public, so the flight detours through the display spot where
 * revealed cards are shown instead of teleporting from the pile corner.
 */
export function isStagedTrashRetrieval(step: EntityTransferStepV2): boolean {
  return (
    step.sourceFace === "public" &&
    step.from?.kind === "zone" &&
    step.from.id.endsWith("-trash") &&
    step.to?.kind === "zone" &&
    step.to.id.endsWith("-hand")
  );
}

export function enhanceCyberpunkCardTransferTiming(
  plan: AnimationPlanV2,
  enabled: boolean,
): AnimationPlanV2 {
  if (!enabled) return plan;
  return {
    ...plan,
    steps: plan.steps.flatMap<AnimationStepV2>((step) => {
      if (step.type !== "entityTransfer") return [step];
      const durationMs = isUnitHandPlay(step)
        ? Math.max(step.durationMs ?? 0, UNIT_ENTRY_DURATION_MS)
        : isHandPlay(step)
          ? (step.durationMs ?? DEFAULT_CARD_TRANSFER_DURATION_MS)
          : Math.max(
              step.durationMs ?? 0,
              isStagedTrashRetrieval(step)
                ? STAGED_RETRIEVAL_DURATION_MS
                : DEFAULT_CARD_TRANSFER_DURATION_MS,
            );
      const transfer = { ...step, durationMs };
      const handAttachment =
        step.from?.kind === "zone" && step.from.id.endsWith("-hand") && step.to?.kind === "entity";
      const playContact =
        step.audioCue === "card.play" ||
        (step.audioCue === "card.move" && (isHandPlay(step) || handAttachment));
      if (!playContact) return [transfer];
      // Paper travel belongs at launch; contact belongs at the visual landing.
      // A zero-duration hold uses the existing scheduler and speed/reduced-motion
      // clock without extending the transfer or adding an independent timer.
      return [
        { ...transfer, audioCue: "card.move" },
        {
          id: `${step.id}:landing-audio`,
          type: "hold",
          startAtMs:
            (step.startAtMs ?? 0) +
            Math.round(
              durationMs *
                (step.destinationPresentation === "underlay"
                  ? 1
                  : isUnitHandPlay(step)
                    ? UNIT_ENTRY_CONTACT_PROGRESS
                    : CARD_TRANSFER_LANDING_PROGRESS),
            ),
          durationMs: 0,
          audioCue: "card.play",
        },
      ];
    }),
  };
}
