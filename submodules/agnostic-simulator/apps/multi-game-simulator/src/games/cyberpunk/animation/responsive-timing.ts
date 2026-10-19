import type { AnimationPlanV2 } from "@tcg/protocol";
import { animationSpeedScale, compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { isStagedTrashRetrieval } from "./three-card-transfer-plan";

export const CYBERPUNK_REFLOW_DURATION_MS = 80;
const ROUTINE_TIMELINE_MS = 480;

/** Keep routine actions brief without shortening combat, effects or public reveals. */
export function paceCyberpunkAnimationPlan(plan: AnimationPlanV2): AnimationPlanV2 {
  const routine = plan.steps.every(
    (step) =>
      !("reveal" in step && step.reveal) &&
      step.type !== "combat" &&
      step.type !== "effect" &&
      step.type !== "comparison" &&
      step.type !== "gameResult" &&
      !(step.type === "entityTransfer" && isStagedTrashRetrieval(step)),
  );
  if (!routine) return plan;
  // Resolve defaults before retiming so omitted durations and audio holds
  // stay on the same relative timeline. User speed still applies afterwards.
  const compiled = compileAnimationPlan(plan, "normal");
  if (compiled.primaryDurationMs <= ROUTINE_TIMELINE_MS * animationSpeedScale("normal"))
    return plan;
  const scale = ROUTINE_TIMELINE_MS / compiled.primaryDurationMs;
  return {
    ...plan,
    steps: compiled.steps.map(({ step, startAtMs, durationMs }) => ({
      ...step,
      startAtMs: Math.round(startAtMs * scale),
      durationMs: Math.round(durationMs * scale),
    })),
  };
}
