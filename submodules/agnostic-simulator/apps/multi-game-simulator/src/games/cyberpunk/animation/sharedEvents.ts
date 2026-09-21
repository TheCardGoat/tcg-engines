import {
  cyberpunkAnimationPlan,
  projectCyberpunkAuthoritativeAnimationPlan,
} from "@tcg/cyberpunk-server-adapter/animation";
import type { AnimationPlanV2 } from "@tcg/protocol";
import type { AnimationScript } from "../engine";

export { projectCyberpunkAuthoritativeAnimationPlan };

export interface CyberpunkSharedAnimationContext {
  viewerSeatId: string | null;
  idPrefix?: string;
}

export function cyberpunkAnimationScriptToAnimationPlans(
  script: AnimationScript,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV2[] {
  const plan = cyberpunkAnimationPlan(`${context.idPrefix ?? "cyberpunk"}:transition`, script);
  return plan ? [projectCyberpunkAuthoritativeAnimationPlan(plan, context.viewerSeatId)] : [];
}

export function isCyberpunkAuthoritativeRollback(
  nextVersion: number,
  authoritativeVersion: number | null,
): boolean {
  return authoritativeVersion !== null && nextVersion < authoritativeVersion;
}
