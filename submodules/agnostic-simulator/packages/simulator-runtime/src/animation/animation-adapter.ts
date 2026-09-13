import { AnimationPlanV2Schema, type AnimationPlanV2 } from "@tcg/protocol/animations";

export interface GameAnimationAdapter<TState, TEngineAnimation> {
  toAnimationPlan(input: {
    fromState: TState;
    toState: TState;
    animations: readonly TEngineAnimation[];
    viewerId: string | null;
    transitionId: string;
  }): AnimationPlanV2 | null;
}

export function adaptAnimationPlan<TState, TEngineAnimation>(
  adapter: GameAnimationAdapter<TState, TEngineAnimation>,
  input: Parameters<GameAnimationAdapter<TState, TEngineAnimation>["toAnimationPlan"]>[0],
): AnimationPlanV2 | null {
  const plan = adapter.toAnimationPlan(input);
  return plan ? AnimationPlanV2Schema.parse(plan) : null;
}
