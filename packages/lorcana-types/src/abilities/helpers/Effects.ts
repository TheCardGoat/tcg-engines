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
import type {
  CardTarget,
  CharacterTarget,
  PlayerTarget,
} from "../target-types";

export const Effects = {
  /**
   * "Draw X cards"
   */
  Draw: (params: { amount: number }): Effect => ({
    type: "draw",
    amount: params.amount,
  }),

  /**
   * "Banish chosen character" or "You may banish chosen character"
   */
  Banish: (params: { target: CharacterTarget; optional?: boolean }): Effect => {
    const banishEffect: Effect = {
      type: "banish",
      target: params.target,
    };

    return params.optional
      ? { type: "optional", effect: banishEffect }
      : banishEffect;
  },

  /**
   * "Remove up to X damage from target"
   */
  RemoveDamage: (params: {
    amount: number;
    target: CharacterTarget;
    upTo?: boolean;
  }): Effect => ({
    type: "remove-damage",
    amount: params.amount,
    target: params.target,
    upTo: params.upTo,
  }),

  /**
   * "Target gains keyword"
   */
  GainKeyword: (params: {
    keyword: string;
    target?: CharacterTarget;
  }): Effect => ({
    type: "gain-keyword",
    keyword: params.keyword,
    target: params.target ?? "SELF",
  }),

  /**
   * "Sequence of effects"
   */
  Sequence: (effects: Effect[]): Effect => ({
    type: "sequence",
    effects,
  }),

  /**
   * "You may [effect]"
   */
  Optional: (effect: Effect): OptionalEffect => ({
    type: "optional",
    effect,
  }),

  /**
   * "Deal X damage to target"
   */
  DealDamage: (params: {
    amount: number;
    target: CharacterTarget;
  }): Effect => ({
    type: "deal-damage",
    amount: params.amount,
    target: params.target,
  }),

  /**
   * "Gain X lore"
   */
  GainLore: (params: { amount: number }): Effect => ({
    type: "gain-lore",
    amount: params.amount,
  }),

  /**
   * "Lose X lore"
   */
  LoseLore: (params: { amount: number }): Effect => ({
    type: "lose-lore",
    amount: params.amount,
  }),

  /**
   * "Exert target"
   */
  Exert: (params?: { target?: CharacterTarget }): Effect => ({
    type: "exert",
    target: params?.target ?? "SELF",
  }),

  /**
   * "Ready target"
   */
  Ready: (params?: { target?: CharacterTarget }): Effect => ({
    type: "ready",
    target: params?.target ?? "SELF",
  }),

  /**
   * "Return target to hand"
   */
  ReturnToHand: (params: { target: CharacterTarget }): Effect => ({
    type: "return-to-hand",
    target: params.target,
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
    type: "shuffle-into-deck",
    target: params.target,
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
    type: "put-on-bottom",
    target: params.target,
  }),
};
