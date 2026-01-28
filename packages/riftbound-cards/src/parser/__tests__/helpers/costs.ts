/**
 * Test helper builders for Riftbound costs
 *
 * Provides fluent builders for creating cost objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type { Cost, Domain } from "@tcg/riftbound-types/abilities/cost-types";
import type { Target } from "@tcg/riftbound-types/targeting";

/**
 * Cost builder helpers for tests
 */
export const Costs = {
  /**
   * Create an energy-only cost
   */
  energy: (amount: number): Cost => ({ energy: amount }),

  /**
   * Create a power-only cost
   */
  power: (...domains: Domain[]): Cost => ({ power: domains }),

  /**
   * Create an exhaust cost
   */
  exhaust: (): Cost => ({ exhaust: true }),

  /**
   * Create a combined energy and power cost
   */
  energyAndPower: (energy: number, ...domains: Domain[]): Cost => ({
    energy,
    power: domains,
  }),

  /**
   * Create an exhaust with energy cost
   */
  exhaustAndEnergy: (energy: number): Cost => ({
    exhaust: true,
    energy,
  }),

  /**
   * Create an exhaust with power cost
   */
  exhaustAndPower: (...domains: Domain[]): Cost => ({
    exhaust: true,
    power: domains,
  }),

  /**
   * Create a discard cost
   */
  discard: (amount: number): Cost => ({ discard: amount }),

  /**
   * Create a recycle cost
   */
  recycle: (amount: number): Cost => ({ recycle: amount }),

  /**
   * Create a kill cost
   */
  kill: (target: Target | "self"): Cost => ({ kill: target }),

  /**
   * Create a spend buff cost
   */
  spendBuff: (): Cost => ({ spend: "buff" }),

  /**
   * Create a return to hand cost
   */
  returnToHand: (target: Target): Cost => ({ returnToHand: target }),

  /**
   * Create a free cost (no cost)
   */
  free: (): Cost => ({}),

  /**
   * Create a custom cost with multiple components
   */
  custom: (cost: Cost): Cost => cost,

  // Domain-specific power costs
  fury: (): Cost => Costs.power("fury"),
  calm: (): Cost => Costs.power("calm"),
  mind: (): Cost => Costs.power("mind"),
  body: (): Cost => Costs.power("body"),
  chaos: (): Cost => Costs.power("chaos"),
  order: (): Cost => Costs.power("order"),
  rainbow: (): Cost => Costs.power("rainbow"),
};
