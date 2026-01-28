/**
 * Test helper builders for Riftbound effects
 *
 * Provides fluent builders for creating effect objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type { Condition } from "@tcg/riftbound-types/abilities/condition-types";
import type { Cost, Domain } from "@tcg/riftbound-types/abilities/cost-types";
import type {
  AddResourceEffect,
  AmountExpression,
  AttachEffect,
  BanishEffect,
  BuffEffect,
  ChannelEffect,
  ChoiceEffect,
  ChoiceOption,
  ConditionalEffect,
  CounterEffect,
  CreateTokenEffect,
  DamageEffect,
  DetachEffect,
  DiscardEffect,
  DoubleMightEffect,
  DrawEffect,
  Effect,
  ExhaustEffect,
  ExtraTurnEffect,
  FightEffect,
  ForEachEffect,
  GainControlOfSpellEffect,
  GrantKeywordEffect,
  GrantKeywordsEffect,
  HealEffect,
  KillEffect,
  LookEffect,
  LookThenEffect,
  ModifyMightEffect,
  MoveEffect,
  OptionalEffect,
  PlayEffect,
  PreventDamageEffect,
  ReadyEffect,
  RecallEffect,
  RecycleEffect,
  RepeatEffect,
  ReturnToHandEffect,
  RevealEffect,
  ScoreEffect,
  SequenceEffect,
  SpendBuffEffect,
  StunEffect,
  SwapMightEffect,
  TakeControlEffect,
  TokenDefinition,
  WinGameEffect,
} from "@tcg/riftbound-types/abilities/effect-types";
import type {
  AnyTarget,
  Location,
  Target,
} from "@tcg/riftbound-types/targeting";

/**
 * Effect builder helpers for tests
 */
export const Effects = {
  // Card manipulation effects
  draw: (
    amount: number | AmountExpression,
    player?: "self" | "opponent" | "each",
  ): DrawEffect =>
    player ? { type: "draw", amount, player } : { type: "draw", amount },

  discard: (
    amount: number | AmountExpression,
    player?: "self" | "opponent" | "each",
    then?: Effect,
  ): DiscardEffect => {
    const effect: DiscardEffect = { type: "discard", amount };
    if (player) (effect as { player: typeof player }).player = player;
    if (then) (effect as { then: Effect }).then = then;
    return effect;
  },

  recycle: (opts?: {
    target?: Target;
    amount?: number;
    from?: "trash" | "board";
  }): RecycleEffect => ({
    type: "recycle",
    ...opts,
  }),

  returnToHand: (target: AnyTarget): ReturnToHandEffect => ({
    type: "return-to-hand",
    target,
  }),

  play: (opts: {
    target: Target;
    from?: "hand" | "trash" | "deck";
    ignoreCost?: boolean | "energy" | "power";
    reduceCost?: Cost;
    toLocation?: Location;
  }): PlayEffect => ({
    type: "play",
    ...opts,
  }),

  banish: (target: AnyTarget): BanishEffect => ({
    type: "banish",
    target,
  }),

  look: (
    amount: number,
    from: "deck" | "rune-deck" | "opponent-hand",
    then?: LookThenEffect,
  ): LookEffect => ({
    type: "look",
    amount,
    from,
    then,
  }),

  reveal: (opts: {
    amount: number;
    from: "deck" | "hand";
    until?: "unit" | "gear" | "spell" | Target;
    then?: Effect;
  }): RevealEffect => ({
    type: "reveal",
    ...opts,
  }),

  // Combat effects
  damage: (
    amount: number | AmountExpression,
    target: AnyTarget,
    split?: boolean,
  ): DamageEffect =>
    split
      ? { type: "damage", amount, target, split }
      : { type: "damage", amount, target },

  heal: (
    amount: number | AmountExpression | "all",
    target: AnyTarget,
  ): HealEffect => ({
    type: "heal",
    amount,
    target,
  }),

  kill: (target: AnyTarget): KillEffect => ({
    type: "kill",
    target,
  }),

  stun: (target: AnyTarget): StunEffect => ({
    type: "stun",
    target,
  }),

  fight: (attacker: AnyTarget, defender: AnyTarget): FightEffect => ({
    type: "fight",
    attacker,
    defender,
  }),

  // Stat modification effects
  modifyMight: (
    amount: number | AmountExpression,
    target: AnyTarget,
    opts?: {
      duration?: "turn" | "permanent" | "combat";
      minimum?: number;
    },
  ): ModifyMightEffect => ({
    type: "modify-might",
    amount,
    target,
    ...opts,
  }),

  buff: (target: AnyTarget): BuffEffect => ({
    type: "buff",
    target,
  }),

  spendBuff: (target?: AnyTarget, then?: Effect): SpendBuffEffect => ({
    type: "spend-buff",
    target,
    then,
  }),

  doubleMight: (
    target: AnyTarget,
    duration?: "turn" | "permanent" | "combat",
  ): DoubleMightEffect => ({
    type: "double-might",
    target,
    duration,
  }),

  swapMight: (
    target1: AnyTarget,
    target2: AnyTarget,
    duration?: "turn" | "permanent",
  ): SwapMightEffect => ({
    type: "swap-might",
    target1,
    target2,
    duration,
  }),

  // Movement effects
  move: (target: AnyTarget, to: Location, from?: Location): MoveEffect => ({
    type: "move",
    target,
    to,
    from,
  }),

  recall: (target: AnyTarget, exhausted?: boolean): RecallEffect => ({
    type: "recall",
    target,
    exhausted,
  }),

  // Resource effects
  addResource: (opts: {
    energy?: number;
    power?: Domain[];
  }): AddResourceEffect => ({
    type: "add-resource",
    ...opts,
  }),

  channel: (amount: number, exhausted?: boolean): ChannelEffect => ({
    type: "channel",
    amount,
    exhausted,
  }),

  ready: (target: AnyTarget): ReadyEffect => ({
    type: "ready",
    target,
  }),

  exhaust: (target: AnyTarget): ExhaustEffect => ({
    type: "exhaust",
    target,
  }),

  // Token effects
  createToken: (
    token: TokenDefinition,
    opts?: {
      location?: "base" | "here" | "battlefield" | Location;
      ready?: boolean;
      amount?: number;
    },
  ): CreateTokenEffect => ({
    type: "create-token",
    token,
    ...opts,
  }),

  // Keyword effects
  grantKeyword: (
    keyword: string,
    target: AnyTarget,
    opts?: {
      value?: number;
      duration?: "turn" | "permanent";
    },
  ): GrantKeywordEffect => ({
    type: "grant-keyword",
    keyword,
    target,
    ...opts,
  }),

  grantKeywords: (
    keywords: string[],
    target: AnyTarget,
    duration?: "turn" | "permanent",
  ): GrantKeywordsEffect => ({
    type: "grant-keywords",
    keywords,
    target,
    duration,
  }),

  // Control flow effects
  sequence: (...effects: Effect[]): SequenceEffect => ({
    type: "sequence",
    effects,
  }),

  choice: (
    options: ChoiceOption[],
    notChosenThisTurn?: boolean,
  ): ChoiceEffect => ({
    type: "choice",
    options,
    notChosenThisTurn,
  }),

  conditional: (
    condition: Condition,
    then: Effect,
    elseEffect?: Effect,
  ): ConditionalEffect => ({
    type: "conditional",
    condition,
    then,
    else: elseEffect,
  }),

  optional: (effect: Effect): OptionalEffect => ({
    type: "optional",
    effect,
  }),

  forEach: (target: Target, effect: Effect): ForEachEffect => ({
    type: "for-each",
    target,
    effect,
  }),

  repeat: (
    cost: Cost,
    effect: Effect,
    differentChoices?: boolean,
  ): RepeatEffect => ({
    type: "repeat",
    cost,
    effect,
    differentChoices,
  }),

  // Special effects
  score: (amount: number, player?: "self" | "opponent"): ScoreEffect => ({
    type: "score",
    amount,
    player,
  }),

  counter: (target?: "spell" | Target, unless?: Cost): CounterEffect => ({
    type: "counter",
    target,
    unless,
  }),

  takeControl: (
    target: AnyTarget,
    duration?: "turn" | "permanent" | "until-leaves",
  ): TakeControlEffect => ({
    type: "take-control",
    target,
    duration,
  }),

  preventDamage: (opts?: {
    target?: AnyTarget;
    amount?: number | "all";
    duration?: "turn" | "next";
  }): PreventDamageEffect => ({
    type: "prevent-damage",
    ...opts,
  }),

  attach: (equipment: AnyTarget, to: AnyTarget): AttachEffect => ({
    type: "attach",
    equipment,
    to,
  }),

  detach: (equipment: AnyTarget): DetachEffect => ({
    type: "detach",
    equipment,
  }),

  gainControlOfSpell: (newChoices?: boolean): GainControlOfSpellEffect => ({
    type: "gain-control-of-spell",
    newChoices,
  }),

  extraTurn: (): ExtraTurnEffect => ({
    type: "extra-turn",
  }),

  winGame: (): WinGameEffect => ({
    type: "win-game",
  }),
};

/**
 * Token presets for common tokens
 */
export const Tokens = {
  recruit: (might = 1): TokenDefinition => ({
    name: "Recruit",
    type: "unit",
    might,
  }),

  sandSoldier: (might = 2): TokenDefinition => ({
    name: "Sand Soldier",
    type: "unit",
    might,
  }),

  mech: (might = 3): TokenDefinition => ({
    name: "Mech",
    type: "unit",
    might,
  }),

  sprite: (might = 3): TokenDefinition => ({
    name: "Sprite",
    type: "unit",
    might,
    keywords: ["Temporary"],
  }),

  gold: (): TokenDefinition => ({
    name: "Gold",
    type: "gear",
  }),
};
