/**
 * Test helper builders for Riftbound conditions
 *
 * Provides fluent builders for creating condition objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type {
  AndCondition,
  AttackingCondition,
  Comparison,
  Condition,
  ControlBattlefieldCondition,
  ControlCondition,
  Cost,
  CountCondition,
  DefendingCondition,
  FirstTimeCondition,
  HasAtLeastCondition,
  InCombatCondition,
  LegionCondition,
  NotCondition,
  OpponentControlsCondition,
  OrCondition,
  PaidAdditionalCostCondition,
  PayCostCondition,
  ScoreCondition,
  ScoreWithinCondition,
  SpentPowerCondition,
  Target,
  ThisTurnCondition,
  WhileAloneCondition,
  WhileAtBattlefieldCondition,
  WhileBuffedCondition,
  WhileMightyCondition,
} from "@tcg/riftbound-types";

/**
 * Condition builder helpers for tests
 */
export const Conditions = {
  // State conditions
  whileMighty: (target?: "self" | Target): WhileMightyCondition =>
    target ? { type: "while-mighty", target } : { type: "while-mighty" },

  whileBuffed: (target?: "self" | Target): WhileBuffedCondition =>
    target ? { type: "while-buffed", target } : { type: "while-buffed" },

  whileAtBattlefield: (
    target?: "self" | Target,
  ): WhileAtBattlefieldCondition =>
    target
      ? { type: "while-at-battlefield", target }
      : { type: "while-at-battlefield" },

  whileAlone: (target?: "self" | Target): WhileAloneCondition =>
    target ? { type: "while-alone", target } : { type: "while-alone" },

  // Turn conditions
  thisTurn: (
    event: ThisTurnCondition["event"],
    count?: Comparison,
  ): ThisTurnCondition =>
    count ? { type: "this-turn", event, count } : { type: "this-turn", event },

  legion: (): LegionCondition => ({ type: "legion" }),

  firstTime: (event: string): FirstTimeCondition => ({
    type: "first-time",
    event,
  }),

  // Count conditions
  count: (target: Target, comparison: Comparison): CountCondition => ({
    type: "count",
    target,
    comparison,
  }),

  hasAtLeast: (count: number, target: Target): HasAtLeastCondition => ({
    type: "has-at-least",
    count,
    target,
  }),

  // Cost conditions
  payCost: (cost: Cost): PayCostCondition => ({
    type: "pay-cost",
    cost,
  }),

  paidAdditionalCost: (): PaidAdditionalCostCondition => ({
    type: "paid-additional-cost",
  }),

  spentPower: (amount: number, domain?: string): SpentPowerCondition => ({
    type: "spent-power",
    amount,
    domain,
  }),

  // Score conditions
  scoreWithin: (
    points: number,
    whose?: "your" | "opponent" | "any",
  ): ScoreWithinCondition => ({
    type: "score-within",
    points,
    whose,
  }),

  score: (
    comparison: Comparison,
    whose?: "your" | "opponent",
  ): ScoreCondition => ({
    type: "score",
    comparison,
    whose,
  }),

  // Combat conditions
  inCombat: (): InCombatCondition => ({ type: "in-combat" }),

  attacking: (target?: "self" | Target): AttackingCondition =>
    target ? { type: "attacking", target } : { type: "attacking" },

  defending: (target?: "self" | Target): DefendingCondition =>
    target ? { type: "defending", target } : { type: "defending" },

  // Control conditions
  control: (target: Target): ControlCondition => ({
    type: "control",
    target,
  }),

  opponentControls: (target: Target): OpponentControlsCondition => ({
    type: "opponent-controls",
    target,
  }),

  controlBattlefield: (count?: Comparison): ControlBattlefieldCondition => ({
    type: "control-battlefield",
    count,
  }),

  // Logical conditions
  and: (...conditions: Condition[]): AndCondition => ({
    type: "and",
    conditions,
  }),

  or: (...conditions: Condition[]): OrCondition => ({
    type: "or",
    conditions,
  }),

  not: (condition: Condition): NotCondition => ({
    type: "not",
    condition,
  }),
};
