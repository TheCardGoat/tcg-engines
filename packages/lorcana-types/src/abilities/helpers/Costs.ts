/**
 * Cost Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building cost definitions.
 * These helpers make it easy to construct common cost patterns.
 *
 * @example
 * ```typescript
 * const cost = Costs.Ink(2);
 * const cost = Costs.Exert();
 * const cost = Costs.Combined(Costs.Ink(1), Costs.Exert());
 * ```
 */

import type { AbilityCost } from "../cost-types";

export const Costs = {
  /**
   * "X ink cost"
   */
  Ink: (amount: number): AbilityCost => ({ ink: amount }),

  /**
   * "Exert this character"
   */
  Exert: (): AbilityCost => ({ exert: true }),

  /**
   * "Banish this character"
   */
  BanishSelf: (): AbilityCost => ({ banishSelf: true }),

  /**
   * "Discard a card"
   */
  Discard: (amount = 1): AbilityCost => ({
    discardCards: amount,
  }),

  /**
   * "Return this card to hand"
   */
  ReturnToHand: (): AbilityCost => ({ returnSelfToHand: true }),

  /**
   * "Damage this character X"
   */
  DamageSelf: (amount: number): AbilityCost => ({
    damageSelf: amount,
  }),

  /**
   * "X ink and exert"
   */
  InkAndExert: (amount: number): AbilityCost => ({
    ink: amount,
    exert: true,
  }),

  /**
   * "X ink and banish"
   */
  InkAndBanish: (amount: number): AbilityCost => ({
    ink: amount,
    banishSelf: true,
  }),

  /**
   * "X ink and discard"
   */
  InkAndDiscard: (amount: number, discardAmount = 1): AbilityCost => ({
    ink: amount,
    discardCards: discardAmount,
  }),

  /**
   * "Exert and banish"
   */
  ExertAndBanish: (): AbilityCost => ({
    exert: true,
    banishSelf: true,
  }),
};
