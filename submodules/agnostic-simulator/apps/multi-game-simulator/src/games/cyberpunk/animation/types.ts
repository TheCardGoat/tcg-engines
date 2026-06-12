import type {
  AnimationScript,
  AnimationStep,
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CombatStep,
  EffectTargetSpec,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
} from "../engine";

export type {
  AnimationScript,
  AnimationStep,
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CombatStep,
  EffectTargetSpec,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
};

export interface CardSnapshot {
  rect: DOMRect;
  outerHTML: string;
}

export interface CardDomCache {
  previous: Map<string, CardSnapshot>;
  current: Map<string, CardSnapshot>;
  previousDice: Map<string, CardSnapshot>;
  currentDice: Map<string, CardSnapshot>;
}

/** UI-side speed multiplier; replay viewer can scale durations 0.5x..4x. */
export type SpeedMultiplier = number;
