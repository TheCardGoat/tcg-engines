import type { useOptionalAnimationRuntime } from "@tcg/simulator-ui";
import { isUnitHandPlay } from "./three-card-transfer-plan";

/** Entry choices wait for destination mounting, not the moving card’s visual clock. */
export function useUnitEntryPromptPending(
  runtime: Pick<
    NonNullable<ReturnType<typeof useOptionalAnimationRuntime>>,
    "activeTransition" | "compiledPlan" | "playbackStartedAtMs"
  > | null,
): boolean {
  // The committed unit and its choices are mounted when preparation ends.
  // Its remaining flight is cosmetic and must not hide the next action.
  return Boolean(
    runtime?.activeTransition?.phase === "preparing" &&
    runtime.compiledPlan?.steps.some(
      ({ step }) => step.type === "entityTransfer" && isUnitHandPlay(step),
    ),
  );
}
