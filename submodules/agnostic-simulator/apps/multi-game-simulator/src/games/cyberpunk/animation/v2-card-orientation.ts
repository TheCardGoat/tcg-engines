import type { AnimationPlanV2 } from "@tcg/protocol";

/** V2 battlefield pose; shared by the resting scene and transition projection. */
export const V2_SPENT_ANGLE = 45;

/**
 * V2 surfaces some entities without mounting them — Eddie cards render as the
 * seat counter, not as tappable cards — so their state-change steps have no
 * registered node to anchor to. Left in the plan they only emit
 * missing-state-change-visual warnings and hold the animation gate open for
 * motion nobody can see; V1 keeps the per-card flips in its physical Eddie row.
 */
export function omitUnmountedEntityStateChanges(
  plan: AnimationPlanV2,
  unmountedEntityIds: ReadonlySet<string>,
): AnimationPlanV2 {
  if (unmountedEntityIds.size === 0) return plan;
  return {
    ...plan,
    steps: plan.steps.filter(
      (step) => !(step.type === "entityStateChange" && unmountedEntityIds.has(step.entity.id)),
    ),
  };
}

export function projectV2CardOrientation(
  plan: AnimationPlanV2,
  fieldIds: ReadonlySet<string>,
): AnimationPlanV2 {
  return {
    ...plan,
    steps: plan.steps.map((step) => {
      if (step.type !== "entityStateChange" || !fieldIds.has(step.entity.id)) return step;
      return {
        ...step,
        ...(step.fromRotationDeg === undefined
          ? {}
          : { fromRotationDeg: (step.fromRotationDeg / 90) * V2_SPENT_ANGLE }),
        ...(step.toRotationDeg === undefined
          ? {}
          : { toRotationDeg: (step.toRotationDeg / 90) * V2_SPENT_ANGLE }),
      };
    }),
  };
}
