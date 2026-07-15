/**
 * Effect Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building effect definitions.
 * These helpers make it easy to construct common effect patterns.
 *
 * @example
 * ```typescript
 * const effect = Effects.Draw({ amount: 2 });
 * const effect = Effects.Banish({ target: Targets.ChallengedCharacter(), optional: true });
 * const effect = Effects.RemoveDamage({ amount: 2, target: Targets.Self() });
 * ```
 */

import type { Effect, OptionalEffect } from "../effect-types";
import type { CardTarget, CharacterTarget, PlayerTarget } from "../target-types";

export const Effects = {
  /**
   * "Draw X cards"
   */
  Draw: (params: { amount: number }): Effect => ({
    amount: params.amount,
    type: "draw",
  }),

  /**
   * "Banish chosen character" or "You may banish chosen character"
   */
  Banish: (params: { target: CharacterTarget; optional?: boolean }): Effect => {
    const banishEffect: Effect = {
      target: params.target,
      type: "banish",
    };

    return params.optional ? { effect: banishEffect, type: "optional" } : banishEffect;
  },

  /**
   * "Remove up to X damage from target"
   */
  RemoveDamage: (params: { amount: number; target: CharacterTarget; upTo?: boolean }): Effect => ({
    amount: params.amount,
    target: params.target,
    type: "remove-damage",
    upTo: params.upTo,
  }),

  /**
   * "Target gains keyword"
   */
  GainKeyword: (params: { keyword: string; target?: CharacterTarget }): Effect => ({
    keyword: params.keyword,
    target: params.target ?? "SELF",
    type: "gain-keyword",
  }),

  /**
   * "Sequence of effects"
   */
  Sequence: (effects: Effect[]): Effect => ({
    effects,
    type: "sequence",
  }),

  /**
   * "You may [effect]"
   */
  Optional: (effect: Effect): OptionalEffect => ({
    effect,
    type: "optional",
  }),

  /**
   * "Deal X damage to target"
   */
  DealDamage: (params: { amount: number; target: CharacterTarget }): Effect => ({
    amount: params.amount,
    target: params.target,
    type: "deal-damage",
  }),

  /**
   * "Gain X lore"
   */
  GainLore: (params: { amount: number }): Effect => ({
    amount: params.amount,
    type: "gain-lore",
  }),

  /**
   * "Lose X lore"
   */
  LoseLore: (params: { amount: number }): Effect => ({
    amount: params.amount,
    type: "lose-lore",
  }),

  /**
   * "Exert target"
   */
  Exert: (params?: { target?: CharacterTarget }): Effect => ({
    target: params?.target ?? "SELF",
    type: "exert",
  }),

  /**
   * "Ready target"
   */
  Ready: (params?: { target?: CharacterTarget }): Effect => ({
    target: params?.target ?? "SELF",
    type: "ready",
  }),

  /**
   * "Return target to hand"
   */
  ReturnToHand: (params: { target: CharacterTarget }): Effect => ({
    target: params.target,
    type: "return-to-hand",
  }),

  /**
   * "Discard target"
   */
  Discard: (params?: { target?: CharacterTarget }): Effect => ({
    type: "discard",
  }),

  /**
   * "Put target into inkwell"
   */
  PutIntoInkwell: (params?: { target?: CharacterTarget }): Effect => ({
    type: "put-into-inkwell",
  }),

  /**
   * "Search deck for card and put into hand"
   */
  SearchDeck: (): Effect => ({
    type: "search-deck",
  }),

  /**
   * "Shuffle target into deck"
   */
  ShuffleIntoDeck: (params: { target: CharacterTarget }): Effect => ({
    target: params.target,
    type: "shuffle-into-deck",
  }),

  /**
   * "Put target on top of deck"
   */
  PutOnTop: (params: { target: CharacterTarget }): Effect => ({
    type: "put-on-top",
  }),

  /**
   * "Put target on bottom of deck"
   */
  PutOnBottom: (params: { target: CharacterTarget }): Effect => ({
    target: params.target,
    type: "put-on-bottom",
  }),
};
