/**
 * Test helper builders for Riftbound effects
 *
 * Provides fluent builders for creating effect objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type {
  AddResourceEffect,
  AmountExpression,
  AnyTarget,
  AttachEffect,
  BanishEffect,
  BuffEffect,
  ChannelEffect,
  ChoiceEffect,
  ChoiceOption,
  Condition,
  ConditionalEffect,
  Cost,
  CounterEffect,
  CreateTokenEffect,
  DamageEffect,
  DetachEffect,
  DiscardEffect,
  Domain,
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
  Location,
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
  Target,
  TokenDefinition,
  WinGameEffect,
} from "@tcg/riftbound-types";

/**
 * Effect builder helpers for tests
 */
export const Effects = {
  // Card manipulation effects
  draw: (amount: number | AmountExpression, player?: "self" | "opponent" | "each"): DrawEffect =>
    player ? { amount, player, type: "draw" } : { amount, type: "draw" },

  discard: (
    amount: number | AmountExpression,
    player?: "self" | "opponent" | "each",
    then?: Effect,
  ): DiscardEffect => {
    const effect: DiscardEffect = { amount, type: "discard" };
    if (player) {
      (effect as { player: typeof player }).player = player;
    }
    if (then) {
      (effect as { then: Effect }).then = then;
    }
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
    target,
    type: "return-to-hand",
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
    target,
    type: "banish",
  }),

  look: (
    amount: number,
    from: "deck" | "rune-deck" | "opponent-hand",
    then?: LookThenEffect,
  ): LookEffect => ({
    amount,
    from,
    then,
    type: "look",
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
  damage: (amount: number | AmountExpression, target: AnyTarget, split?: boolean): DamageEffect =>
    split ? { amount, split, target, type: "damage" } : { amount, target, type: "damage" },

  heal: (amount: number | AmountExpression | "all", target: AnyTarget): HealEffect => ({
    amount,
    target,
    type: "heal",
  }),

  kill: (target: AnyTarget): KillEffect => ({
    target,
    type: "kill",
  }),

  stun: (target: AnyTarget): StunEffect => ({
    target,
    type: "stun",
  }),

  fight: (attacker: AnyTarget, defender: AnyTarget): FightEffect => ({
    attacker,
    defender,
    type: "fight",
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
    amount,
    target,
    type: "modify-might",
    ...opts,
  }),

  buff: (target: AnyTarget): BuffEffect => ({
    target,
    type: "buff",
  }),

  spendBuff: (target?: AnyTarget, then?: Effect): SpendBuffEffect => ({
    target,
    then,
    type: "spend-buff",
  }),

  doubleMight: (
    target: AnyTarget,
    duration?: "turn" | "permanent" | "combat",
  ): DoubleMightEffect => ({
    duration,
    target,
    type: "double-might",
  }),

  swapMight: (
    target1: AnyTarget,
    target2: AnyTarget,
    duration?: "turn" | "permanent",
  ): SwapMightEffect => ({
    duration,
    target1,
    target2,
    type: "swap-might",
  }),

  // Movement effects
  move: (target: AnyTarget, to: Location, from?: Location): MoveEffect => ({
    from,
    target,
    to,
    type: "move",
  }),

  recall: (target: AnyTarget, exhausted?: boolean): RecallEffect => ({
    exhausted,
    target,
    type: "recall",
  }),

  // Resource effects
  addResource: (opts: { energy?: number; power?: Domain[] }): AddResourceEffect => ({
    type: "add-resource",
    ...opts,
  }),

  channel: (amount: number, exhausted?: boolean): ChannelEffect => ({
    amount,
    exhausted,
    type: "channel",
  }),

  ready: (target: AnyTarget): ReadyEffect => ({
    target,
    type: "ready",
  }),

  exhaust: (target: AnyTarget): ExhaustEffect => ({
    target,
    type: "exhaust",
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
    token,
    type: "create-token",
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
    keyword,
    target,
    type: "grant-keyword",
    ...opts,
  }),

  grantKeywords: (
    keywords: string[],
    target: AnyTarget,
    duration?: "turn" | "permanent",
  ): GrantKeywordsEffect => ({
    duration,
    keywords,
    target,
    type: "grant-keywords",
  }),

  // Control flow effects
  sequence: (...effects: Effect[]): SequenceEffect => ({
    effects,
    type: "sequence",
  }),

  choice: (options: ChoiceOption[], notChosenThisTurn?: boolean): ChoiceEffect => ({
    notChosenThisTurn,
    options,
    type: "choice",
  }),

  conditional: (condition: Condition, then: Effect, elseEffect?: Effect): ConditionalEffect => ({
    condition,
    else: elseEffect,
    then,
    type: "conditional",
  }),

  optional: (effect: Effect): OptionalEffect => ({
    effect,
    type: "optional",
  }),

  forEach: (target: Target, effect: Effect): ForEachEffect => ({
    effect,
    target,
    type: "for-each",
  }),

  repeat: (cost: Cost, effect: Effect, differentChoices?: boolean): RepeatEffect => ({
    cost,
    differentChoices,
    effect,
    type: "repeat",
  }),

  // Special effects
  score: (amount: number, player?: "self" | "opponent"): ScoreEffect => ({
    amount,
    player,
    type: "score",
  }),

  counter: (target?: "spell" | Target, unless?: Cost): CounterEffect => ({
    target,
    type: "counter",
    unless,
  }),

  takeControl: (
    target: AnyTarget,
    duration?: "turn" | "permanent" | "until-leaves",
  ): TakeControlEffect => ({
    duration,
    target,
    type: "take-control",
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
    equipment,
    to,
    type: "attach",
  }),

  detach: (equipment: AnyTarget): DetachEffect => ({
    equipment,
    type: "detach",
  }),

  gainControlOfSpell: (newChoices?: boolean): GainControlOfSpellEffect => ({
    newChoices,
    type: "gain-control-of-spell",
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
  gold: (): TokenDefinition => ({
    name: "Gold",
    type: "gear",
  }),

  mech: (might = 3): TokenDefinition => ({
    might,
    name: "Mech",
    type: "unit",
  }),

  recruit: (might = 1): TokenDefinition => ({
    might,
    name: "Recruit",
    type: "unit",
  }),

  sandSoldier: (might = 2): TokenDefinition => ({
    might,
    name: "Sand Soldier",
    type: "unit",
  }),

  sprite: (might = 3): TokenDefinition => ({
    keywords: ["Temporary"],
    might,
    name: "Sprite",
    type: "unit",
  }),
};
