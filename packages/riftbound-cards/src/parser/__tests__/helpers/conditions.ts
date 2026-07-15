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
    target ? { target, type: "while-mighty" } : { type: "while-mighty" },

  whileBuffed: (target?: "self" | Target): WhileBuffedCondition =>
    target ? { target, type: "while-buffed" } : { type: "while-buffed" },

  whileAtBattlefield: (target?: "self" | Target): WhileAtBattlefieldCondition =>
    target ? { target, type: "while-at-battlefield" } : { type: "while-at-battlefield" },

  whileAlone: (target?: "self" | Target): WhileAloneCondition =>
    target ? { target, type: "while-alone" } : { type: "while-alone" },

  // Turn conditions
  thisTurn: (event: ThisTurnCondition["event"], count?: Comparison): ThisTurnCondition =>
    count ? { count, event, type: "this-turn" } : { event, type: "this-turn" },

  legion: (): LegionCondition => ({ type: "legion" }),

  firstTime: (event: string): FirstTimeCondition => ({
    event,
    type: "first-time",
  }),

  // Count conditions
  count: (target: Target, comparison: Comparison): CountCondition => ({
    comparison,
    target,
    type: "count",
  }),

  hasAtLeast: (count: number, target: Target): HasAtLeastCondition => ({
    count,
    target,
    type: "has-at-least",
  }),

  // Cost conditions
  payCost: (cost: Cost): PayCostCondition => ({
    cost,
    type: "pay-cost",
  }),

  paidAdditionalCost: (): PaidAdditionalCostCondition => ({
    type: "paid-additional-cost",
  }),

  spentPower: (amount: number, domain?: string): SpentPowerCondition => ({
    amount,
    domain,
    type: "spent-power",
  }),

  // Score conditions
  scoreWithin: (points: number, whose?: "your" | "opponent" | "any"): ScoreWithinCondition => ({
    points,
    type: "score-within",
    whose,
  }),

  score: (comparison: Comparison, whose?: "your" | "opponent"): ScoreCondition => ({
    comparison,
    type: "score",
    whose,
  }),

  // Combat conditions
  inCombat: (): InCombatCondition => ({ type: "in-combat" }),

  attacking: (target?: "self" | Target): AttackingCondition =>
    target ? { target, type: "attacking" } : { type: "attacking" },

  defending: (target?: "self" | Target): DefendingCondition =>
    target ? { target, type: "defending" } : { type: "defending" },

  // Control conditions
  control: (target: Target): ControlCondition => ({
    target,
    type: "control",
  }),

  opponentControls: (target: Target): OpponentControlsCondition => ({
    target,
    type: "opponent-controls",
  }),

  controlBattlefield: (count?: Comparison): ControlBattlefieldCondition => ({
    count,
    type: "control-battlefield",
  }),

  // Logical conditions
  and: (...conditions: Condition[]): AndCondition => ({
    conditions,
    type: "and",
  }),

  or: (...conditions: Condition[]): OrCondition => ({
    conditions,
    type: "or",
  }),

  not: (condition: Condition): NotCondition => ({
    condition,
    type: "not",
  }),
};
