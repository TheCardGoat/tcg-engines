import { AnimationPlanV1Schema, type AnimationPlanV1 } from "@tcg/protocol";

export interface AnimationPlanAdapter<TInput, TContext = void> {
  readonly id: string;
  readonly toAnimationPlans: (input: TInput, context: TContext) => readonly AnimationPlanV1[];
}

/**
 * Canonical boundary between game-native events and shared simulator motion.
 * Every adapter result is runtime-validated before it can reach the renderer.
 */
export function adaptAnimationPlans<TInput, TContext>(
  adapter: AnimationPlanAdapter<TInput, TContext>,
  input: TInput,
  context: TContext,
): AnimationPlanV1[] {
  return adapter.toAnimationPlans(input, context).map((plan) => AnimationPlanV1Schema.parse(plan));
}
