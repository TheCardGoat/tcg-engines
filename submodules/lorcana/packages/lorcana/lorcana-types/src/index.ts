/**
 * @tcg/lorcana-types
 *
 * Complete type definitions for Disney Lorcana TCG.
 * This package provides types without runtime dependencies,
 * allowing type-safe card definitions without coupling to the game engine.
 */

// Re-export all ability types
export * from "./abilities";

// Re-export all card types
export * from "./cards";

// Re-export all game state types
export * from "./game";

// Re-export canonical targeting DSL types
export * from "./branded";
export type {
  BaseContext,
  DeclarativeCardTargetDSL,
  MoveTargetSelection,
  OwnerScope,
  PlayerTargetDSL,
  PlayerTargetScope,
  SelectorScope,
  TargetCount,
  TargetDSL,
} from "./targeting/target-dsl";

export type {
  LorcanaCardTarget,
  LorcanaCardType,
  LorcanaCharacterTarget,
  LorcanaItemTarget,
  LorcanaLocationTarget,
  LorcanaPlayerTarget,
  LorcanaTarget,
  LorcanaTargetDSL,
  LorcanaTargetReference,
  LorcanaZoneId,
} from "./targeting/lorcana-target-dsl";

export type {
  Amount,
  AmountExpr,
  AmountString,
  AmountRef,
  CardFilter,
  CardSelectionFilter,
  ChosenCardCostMaxCostConstraint,
  ComparisonOperator,
  EffectDuration,
  FilterExpr,
  FilterSubject,
  PlayerFilter,
  UpToAmount,
  VariableAmount,
  VariableAmountOperand,
} from "./expressions";
export { isUpToAmount, isVariableAmount, unwrapAmount } from "./expressions";

export type { MillEffect } from "./abilities/effect-types";

// Re-export deck format validation
export * from "./decks";

export { shuffleArray } from "./utils/shuffle";
export { createStopwatch, measureAsync, measureSync, nowMs } from "./utils/performance";
export type { PerformanceMeasurement, PerformanceObserver } from "./utils/performance";
