/**
 * Ability Helpers - DSL for Card Abilities
 *
 * This module provides a Domain-Specific Language (DSL) for implementing Lorcana card abilities
 * in a more readable and maintainable way.
 *
 * ## Phases
 *
 * - **Phase 1**: Core helpers for keywords, triggers, and basic effects
 * - **Phase 2**: Core trigger patterns (wheneverQuest, whenBanished) and effect builders (dealDamage)
 * - **Phase 3**: Advanced keywords (Shift, Ward, Reckless) and effect builders (banish, ready, exert)
 * - **Phase 4**: Advanced patterns (activated abilities, static abilities, conditional effects)
 *
 * ## Usage Examples
 *
 * ### Keyword Abilities
 * ```typescript
 * import { evasive, rush, shift, ward } from "./ability-helpers";
 *
 * abilities: [
 *   evasive("37j-1"),
 *   rush("czp-1"),
 *   shift("4hp-1", 3, "Captain Hook"),
 *   ward("10b-1")
 * ]
 * ```
 *
 * ### Triggered Abilities
 * ```typescript
 * import { whenPlay, wheneverQuest, whenBanished, optional, draw } from "./ability-helpers";
 *
 * abilities: [
 *   whenPlay("q21-1", {
 *     text: "When you play this character, you may draw a card.",
 *     playedBy: "you",
 *     playedCard: "SELF",
 *     then: optional(draw(1))
 *   }),
 *   wheneverQuest("1ro-1", {
 *     text: "Whenever this character quests, deal 1 damage to chosen character.",
 *     on: "SELF",
 *     then: dealDamage(1)
 *   })
 * ]
 * ```
 *
 * ### Activated Abilities
 * ```typescript
 * import { activated, gainKeyword, draw } from "./ability-helpers";
 *
 * abilities: [
 *   activated("1j9-1", {
 *     name: "COMMAND",
 *     text: "COMMAND {E} — Chosen character gains Support this turn.",
 *     cost: { exert: true },
 *     effect: gainKeyword("Support", "CHOSEN_CHARACTER")
 *   })
 * ]
 * ```
 *
 * ### Static Abilities
 * ```typescript
 * import { staticAbility, modifyStat } from "./ability-helpers";
 *
 * abilities: [
 *   staticAbility("sj3-3", {
 *     name: "GLAM",
 *     text: "GLAM This character gets +1 {L} for each item you have in play.",
 *     effect: modifyStat("lore", { type: "items-in-play", controller: "you" }, "SELF", "permanent")
 *   })
 * ]
 * ```
 *
 * ### Conditional Effects
 * ```typescript
 * import { conditional, draw, hasCharacterCount } from "./ability-helpers";
 *
 * effect: conditional(
 *   hasCharacterCount(3, "greater-or-equal"),
 *   draw(2),
 *   draw(1)
 * )
 * ```
 */

import type {
  AbilityCost,
  AbilityDefinition,
  Amount,
  BanishEffect,
  CharacterTarget,
  Condition,
  ConditionalEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  Effect,
  EffectDuration,
  ExertEffect,
  GainKeywordEffect,
  LocationTarget,
  ModifyStatEffect,
  OptionalEffect,
  PlayerTarget,
  ReadyEffect,
  RestrictionEffect,
  StaticEffect,
  TriggerCardType,
  TriggerSubject,
  TriggerSubjectQuery,
} from "@tcg/lorcana-types";

// ============================================================================
// Keyword Abilities - Top 5 Most Common
// ============================================================================

/**
 * Create an Evasive keyword ability
 *
 * @param id - The ability ID (e.g., "37j-1")
 * @param text - Optional full text (defaults to "Evasive")
 */
export function evasive(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Evasive",
    text: text || "Evasive",
  };
}

/**
 * Create a Support keyword ability
 *
 * @param id - The ability ID (e.g., "uio-1")
 * @param text - Optional full text (defaults to "Support")
 */
export function support(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Support",
    text: text || "Support",
  };
}

/**
 * Create a Bodyguard keyword ability
 *
 * @param id - The ability ID (e.g., "rvm-1")
 * @param text - Optional full text (defaults to "Bodyguard")
 */
export function bodyguard(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Bodyguard",
    text: text || "Bodyguard",
  };
}

/**
 * Create a Rush keyword ability
 *
 * @param id - The ability ID (e.g., "czp-1")
 * @param text - Optional full text (defaults to "Rush")
 */
export function rush(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Rush",
    text: text || "Rush",
  };
}

/**
 * Create a Challenger keyword ability with value
 *
 * @param id - The ability ID (e.g., "1dn-1")
 * @param value - Challenger value (e.g., Challenger +2)
 * @param text - Optional full text
 */
export function challenger(
  id: string,
  value: number,
  text?: string,
): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Challenger",
    value,
    text: text || `Challenger +${value}`,
  };
}

/**
 * Create a Singer keyword ability with value
 *
 * @param id - The ability ID (e.g., "1k6-1")
 * @param value - Singer value (e.g., Singer 5)
 * @param text - Optional full text
 */
export function singer(
  id: string,
  value: number,
  text?: string,
): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Singer",
    value,
    text: text || `Singer ${value}`,
  };
}

/**
 * Create a Shift keyword ability with cost
 *
 * @param id - The ability ID (e.g., "4hp-1")
 * @param cost - The ink cost (e.g., 3 for Shift 3)
 * @param shiftTarget - Optional character name to shift onto (e.g., "Captain Hook")
 * @param text - Optional full text
 *
 * @example
 * ```typescript
 * // Shift 3
 * shift("4hp-1", 3)
 *
 * // Shift 3 onto Captain Hook
 * shift("4hp-1", 3, "Captain Hook")
 * ```
 */
export function shift(
  id: string,
  cost: number,
  shiftTarget?: string,
  text?: string,
): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Shift",
    cost: { ink: cost },
    ...(shiftTarget && { shiftTarget }),
    text: text || `Shift ${cost}`,
  };
}

/**
 * Create a Ward keyword ability
 *
 * @param id - The ability ID (e.g., "10b-1")
 * @param text - Optional full text (defaults to "Ward")
 */
export function ward(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Ward",
    text: text || "Ward",
  };
}

/**
 * Create a Reckless keyword ability
 *
 * @param id - The ability ID (e.g., "1s6-1")
 * @param text - Optional full text (defaults to "Reckless")
 */
export function reckless(id: string, text?: string): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Reckless",
    text: text || "Reckless",
  };
}

/**
 * Create a Resist keyword ability with value
 *
 * @param id - The ability ID (e.g., "some-id-1")
 * @param value - Resist value (e.g., Resist +2)
 * @param text - Optional full text
 */
export function resist(
  id: string,
  value: number,
  text?: string,
): AbilityDefinition {
  return {
    id,
    type: "keyword",
    keyword: "Resist",
    value,
    text: text || `Resist +${value}`,
  };
}

// ============================================================================
// Trigger Helpers - Phase 1: whenPlay
// Phase 2: wheneverQuest, whenBanished
// ============================================================================

/**
 * Trigger: When you play this card
 *
 * @param id - The ability ID (e.g., "q21-1")
 * @param config - Configuration object
 * @param config.name - Optional ability name (ALL CAPS)
 * @param config.text - Full ability text
 * @param config.playedBy - Who plays the card (default: "you")
 * @param config.playedCard - What card is played (default: "SELF" for "this character")
 * @param config.if - Optional condition
 * @param config.then - Effect to execute
 *
 * @example
 * ```typescript
 * // When you play this character
 * whenPlay("q21-1", {
 *   name: "GUESS WHAT?",
 *   text: "When you play this character, you may draw a card.",
 *   playedBy: "you",    // who plays
 *   playedCard: "SELF", // what is played (this character)
 *   then: optional(draw(1))
 * })
 *
 * // When you play any character
 * whenPlay("q21-2", {
 *   text: "Whenever you play a character, draw a card.",
 *   playedBy: "you",
 *   playedCard: { cardType: "character" },
 *   then: draw(1)
 * })
 *
 * // When opponent plays a character
 * whenPlay("q21-3", {
 *   text: "Whenever opponent plays a character, draw a card.",
 *   playedBy: "opponent",
 *   playedCard: { cardType: "character" },
 *   then: draw(1)
 * })
 * ```
 */
export function whenPlay(
  id: string,
  config: TriggeredAbilityConfig,
): AbilityDefinition {
  // Build the "on" property based on playedBy and playedCard
  let on: TriggerSubject;

  if (config.playedCard === "SELF") {
    // "When you play this character" - SELF implies playedBy is "you"
    on = "SELF";
  } else if (config.playedCard) {
    // "When you play a character" - need to specify controller and card type
    const query: TriggerSubjectQuery = {
      controller: config.playedBy ?? "you",
      ...config.playedCard,
    };
    on = query;
  } else {
    // Default to SELF if not specified
    on = "SELF";
  }

  return {
    id,
    type: "triggered",
    name: config.name,
    text: config.text,
    trigger: {
      event: "play",
      timing: "when",
      on,
    },
    condition: config.if,
    effect: config.then,
  };
}

/**
 * Trigger: Whenever this character quests
 *
 * @param id - The ability ID (e.g., "1ro-1")
 * @param config - Configuration object
 * @param config.name - Optional ability name (ALL CAPS)
 * @param config.text - Full ability text
 * @param config.on - What quests (default: "SELF" for "this character")
 * @param config.if - Optional condition
 * @param config.then - Effect to execute
 *
 * @example
 * ```typescript
 * // Whenever this character quests
 * wheneverQuest("1ro-1", {
 *   name: "STAGE A LITTLE ACCIDENT",
 *   text: "Whenever this character quests, you may deal 1 damage to chosen character.",
 *   on: "SELF",
 *   then: optional(dealDamage(1, "CHOSEN_CHARACTER"))
 * })
 * ```
 */
export function wheneverQuest(
  id: string,
  config: {
    name?: string;
    text: string;
    on?: TriggerSubject;
    if?: any;
    then: any;
  },
): AbilityDefinition {
  return {
    id,
    type: "triggered",
    name: config.name,
    text: config.text,
    trigger: {
      event: "quest",
      timing: "whenever",
      on: config.on ?? "SELF",
    },
    condition: config.if,
    effect: config.then,
  };
}

/**
 * Trigger: When/Whenever a character is banished
 *
 * @param id - The ability ID (e.g., "8a5-1")
 * @param config - Configuration object
 * @param config.name - Optional ability name (ALL CAPS)
 * @param config.text - Full ability text
 * @param config.timing - "when" or "whenever" (default: "whenever")
 * @param config.on - What is banished (default: "SELF" for "this character")
 * @param config.if - Optional condition
 * @param config.then - Effect to execute
 *
 * @example
 * ```typescript
 * // When this character is banished
 * whenBanished("some-id", {
 *   text: "When this character is banished, draw a card.",
 *   timing: "when",
 *   on: "SELF",
 *   then: draw(1)
 * })
 *
 * // Whenever one of your characters with Bodyguard is banished
 * whenBanished("8a5-1", {
 *   name: "ALL FOR ONE AND ONE FOR ALL",
 *   text: "Whenever one of your characters with Bodyguard is banished, you may draw a card.",
 *   timing: "whenever",
 *   on: "YOUR_OTHER_CHARACTERS",
 *   then: optional(draw(1))
 * })
 * ```
 */
export function whenBanished(
  id: string,
  config: {
    name?: string;
    text: string;
    timing?: "when" | "whenever";
    on?: TriggerSubject;
    if?: any;
    then: any;
  },
): AbilityDefinition {
  return {
    id,
    type: "triggered",
    name: config.name,
    text: config.text,
    trigger: {
      event: "banish",
      timing: config.timing ?? "whenever",
      on: config.on ?? "SELF",
    },
    condition: config.if,
    effect: config.then,
  };
}

// ============================================================================
// Effect Helpers - Basic (for whenPlay examples)
// ============================================================================

/**
 * Draw cards effect
 *
 * @param amount - Number of cards to draw
 * @param target - Target (defaults to "CONTROLLER")
 */
export function draw(
  amount: number,
  target: PlayerTarget = "CONTROLLER",
): DrawEffect {
  return {
    type: "draw" as const,
    amount,
    target,
  };
}

/**
 * Discard cards effect
 *
 * @param amount - Number of cards to discard
 * @param target - Target (defaults to "CONTROLLER")
 * @param chosen - Whether player chooses which cards to discard (defaults to false)
 */
export function discard(
  amount: number,
  target: PlayerTarget = "CONTROLLER",
  chosen = false,
): DiscardEffect {
  return {
    type: "discard" as const,
    amount,
    target,
    ...(chosen && { chosen: true }),
  };
}

/**
 * Optional effect (you may...)
 *
 * @param effect - The effect to make optional
 * @param chooser - Who chooses (defaults to "CONTROLLER")
 */
export function optional(
  effect: Effect,
  chooser: "CONTROLLER" | "OPPONENT" = "CONTROLLER",
): OptionalEffect {
  return {
    type: "optional" as const,
    effect,
    chooser,
  };
}

/**
 * Sequence of effects (do A, then B)
 *
 * @param effects - Effects to execute in order
 */
export function sequence(...effects: any[]) {
  return {
    type: "sequence" as const,
    steps: effects,
  };
}

/**
 * Remove damage effect
 *
 * @param amount - Number of damage to remove
 * @param target - Target (defaults to "CHOSEN_CHARACTER")
 * @param upTo - Whether it's "up to" amount (defaults to false)
 */
export function removeDamage(
  amount: number,
  target: any = "CHOSEN_CHARACTER",
  upTo = false,
) {
  return {
    type: "remove-damage" as const,
    amount,
    target,
    ...(upTo && { upTo: true }),
  };
}

/**
 * Deal damage effect
 *
 * @param amount - Number of damage to deal
 * @param target - Target (defaults to "CHOSEN_CHARACTER")
 *
 * @example
 * ```typescript
 * // Deal 3 damage to chosen character
 * dealDamage(3, "CHOSEN_CHARACTER")
 *
 * // Deal 1 damage to all opposing characters
 * dealDamage(1, "ALL_OPPOSING_CHARACTERS")
 * ```
 */
export function dealDamage(
  amount: number,
  target: any = "CHOSEN_CHARACTER",
): DealDamageEffect {
  return {
    type: "deal-damage" as const,
    amount,
    target,
  };
}

/**
 * Banish effect
 *
 * @param target - Target to banish (defaults to "CHOSEN_CHARACTER")
 *
 * @example
 * ```typescript
 * // Banish chosen character
 * banish("CHOSEN_CHARACTER")
 *
 * // Banish all opposing items
 * banish("ALL_OPPOSING_ITEMS")
 * ```
 */
export function banish(target: any = "CHOSEN_CHARACTER"): BanishEffect {
  return {
    type: "banish" as const,
    target,
  };
}

/**
 * Ready effect
 *
 * @param target - Target to ready (defaults to "CHOSEN_CHARACTER")
 * @param restriction - Optional restriction after readying ("cant-quest", "cant-challenge", "cant-quest-or-challenge")
 *
 * @example
 * ```typescript
 * // Ready chosen character
 * ready("CHOSEN_CHARACTER")
 *
 * // Ready chosen character, they can't quest this turn
 * ready("CHOSEN_CHARACTER", "cant-quest")
 * ```
 */
export function ready(
  target: any = "CHOSEN_CHARACTER",
  restriction?: "cant-quest" | "cant-challenge" | "cant-quest-or-challenge",
): ReadyEffect {
  return {
    type: "ready" as const,
    target,
    ...(restriction && { restriction }),
  };
}

/**
 * Exert effect
 *
 * @param target - Target to exert (defaults to "CHOSEN_CHARACTER")
 *
 * @example
 * ```typescript
 * // Exert chosen character
 * exert("CHOSEN_CHARACTER")
 * ```
 */
export function exert(target: any = "CHOSEN_CHARACTER"): ExertEffect {
  return {
    type: "exert" as const,
    target,
  };
}

/**
 * Helper to create a target for all your characters with a specific classification
 *
 * @param classification - The classification to filter by (e.g., "Musketeer")
 * @param options - Additional options
 * @param options.excludeSelf - Exclude self from targets (default: false)
 *
 * @example
 * ```typescript
 * // All your Musketeer characters
 * allYourCharactersWithClassification("Musketeer")
 * ```
 */
export function allYourCharactersWithClassification(
  classification: string,
  options?: { excludeSelf?: boolean },
) {
  return {
    selector: "all" as const,
    count: "all" as const,
    owner: "you" as const,
    cardTypes: ["character"] as const,
    zones: ["play"] as const,
    filters: [{ type: "has-classification" as const, classification }],
    ...(options?.excludeSelf && { excludeSelf: true }),
  };
}

/**
 * Move cards between zones (unified movement effect)
 *
 * @param from - Source zone
 * @param to - Destination zone
 * @param config - Configuration object
 * @param config.amount - Number of cards to move (default: 1, use "all" for all matching)
 * @param config.cardType - Filter by card type
 * @param config.cardName - Filter by card name
 * @param config.target - Target for selection (when from is a zone with multiple cards)
 * @param config.shuffle - For deck destinations: whether to shuffle
 * @param config.ordering - For deck-bottom: ordering preference
 * @param config.exerted - For inkwell/play: whether card enters exerted
 * @param config.facedown - For inkwell: whether card is placed facedown
 * @param config.under - For "under" destination: which card to put under
 * @param config.intoDeck - For deck destinations: whose deck
 *
 * @example
 * ```typescript
 * // Return a character from discard to hand
 * moveCards("discard", "hand", {
 *   cardType: "character",
 *   amount: 1,
 *   target: "CONTROLLER"
 * })
 *
 * // Return chosen character to hand
 * moveCards("play", "hand", {
 *   target: "CHOSEN_CHARACTER"
 * })
 *
 * // Put top card of deck into inkwell
 * moveCards("top-of-deck", "inkwell", {
 *   amount: 1,
 *   target: "CONTROLLER",
 *   exerted: true,
 *   facedown: true
 * })
 * ```
 */
export function moveCards(
  from:
    | "play"
    | "hand"
    | "discard"
    | "deck"
    | "inkwell"
    | "under"
    | "top-of-deck",
  to:
    | "hand"
    | "discard"
    | "deck"
    | "inkwell"
    | "play"
    | "under"
    | "deck-top"
    | "deck-bottom",
  config?: {
    amount?: number | "all";
    cardType?: "character" | "action" | "item" | "location" | "song";
    cardName?: string;
    target?: any;
    shuffle?: boolean;
    ordering?: "player-choice" | "random";
    exerted?: boolean;
    facedown?: boolean;
    under?: any;
    intoDeck?: "owner" | "controller";
  },
) {
  return {
    type: "move-cards" as const,
    from,
    to,
    ...(config || {}),
  };
}

// ============================================================================
// Condition Helpers
// ============================================================================

/**
 * Has classification condition
 *
 * @param classification - The classification to check for (e.g., "Musketeer")
 * @param controller - Whose characters to check (defaults to "you")
 */
export function hasClassification(
  classification: string,
  controller: "you" | "opponent" | "any" = "you",
): Condition {
  return {
    type: "has-character-with-classification",
    classification,
    controller,
  };
}

/**
 * Has character named condition
 *
 * @param name - The character name to check for (e.g., "Elsa")
 * @param controller - Whose characters to check (defaults to "you")
 */
export function hasCharacterNamed(
  name: string,
  controller: "you" | "opponent" | "any" = "you",
): Condition {
  return {
    type: "has-named-character",
    name,
    controller,
  };
}

/**
 * Has character count condition
 *
 * @param count - The count to compare against
 * @param comparison - Comparison operator (defaults to "greater-or-equal")
 * @param controller - Whose characters to check (defaults to "you")
 * @param classification - Optional classification filter
 * @param keyword - Optional keyword filter
 */
export function hasCharacterCount(
  count: number,
  comparison:
    | "greater-or-equal"
    | "less-or-equal"
    | "greater"
    | "less"
    | "equal" = "greater-or-equal",
  controller: "you" | "opponent" | "any" = "you",
  classification?: string,
  keyword?: string,
): Condition {
  return {
    type: "has-character-count",
    controller,
    comparison,
    count,
    ...(classification && { classification }),
    ...(keyword && { keyword }),
  };
}

/**
 * Has card under condition
 */
export function hasCardUnder(): Condition {
  return {
    type: "has-card-under",
  };
}

/**
 * Has any damage condition (character has any damage)
 */
export function hasAnyDamage(): Condition {
  return {
    type: "has-any-damage",
  };
}

// ============================================================================
// Restriction Helpers
// ============================================================================

/**
 * Create a restriction effect
 *
 * @param restriction - Type of restriction to apply
 * @param target - Target for the restriction (defaults to "SELF")
 * @param duration - Optional duration (defaults to "permanent")
 *
 * @example
 * ```typescript
 * // This character can't sing songs
 * restrict("cant-sing", "SELF")
 *
 * // Chosen character can't quest until start of their next turn
 * restrict("cant-quest", "CHOSEN_CHARACTER", "until-start-of-next-turn")
 *
 * // Opposing characters can't challenge this character
 * restrict("cant-challenge", "SELF")
 * ```
 */
export function restrict(
  restriction:
    | "cant-quest"
    | "cant-challenge"
    | "cant-be-challenged"
    | "cant-ready"
    | "cant-quest-or-challenge"
    | "cant-be-dealt-damage"
    | "cant-sing"
    | "cant-move"
    | "enters-play-exerted"
    | "skip-draw-step",
  target: CharacterTarget | PlayerTarget = "SELF",
  duration?: EffectDuration,
): RestrictionEffect {
  return {
    type: "restriction",
    restriction,
    target,
    ...(duration && { duration }),
  };
}

// ============================================================================
// Advanced Effect Helpers - Phase 4
// ============================================================================

/**
 * Gain keyword effect
 *
 * @param keyword - The keyword to grant (e.g., "Rush", "Support")
 * @param target - Target character (defaults to "CHOSEN_CHARACTER")
 * @param value - Optional value for Challenger/Resist (e.g., Challenger +2)
 * @param duration - Optional duration (defaults to "this-turn")
 *
 * @example
 * ```typescript
 * // Chosen character gains Rush this turn
 * gainKeyword("Rush", "CHOSEN_CHARACTER")
 *
 * // Your characters gain Support this turn
 * gainKeyword("Support", "YOUR_CHARACTERS")
 *
 * // Chosen character gains Challenger +2 this turn
 * gainKeyword("Challenger", "CHOSEN_CHARACTER", 2)
 * ```
 */
export function gainKeyword(
  keyword:
    | "Rush"
    | "Ward"
    | "Evasive"
    | "Bodyguard"
    | "Support"
    | "Reckless"
    | "Alert"
    | "Challenger"
    | "Resist",
  target: CharacterTarget = "CHOSEN_CHARACTER",
  value?: number,
  duration: "this-turn" | "permanent" = "this-turn",
): GainKeywordEffect {
  return {
    type: "gain-keyword",
    keyword,
    target,
    ...(value !== undefined && { value }),
    ...(duration && { duration }),
  };
}

/**
 * Modify stat effect
 *
 * @param stat - The stat to modify ("strength", "willpower", "lore")
 * @param modifier - The modifier (number or dynamic modifier object)
 * @param target - Target character/location (defaults to "CHOSEN_CHARACTER")
 * @param duration - Optional duration (defaults to "this-turn")
 *
 * @example
 * ```typescript
 * // Chosen character gets +2 strength this turn
 * modifyStat("strength", 2, "CHOSEN_CHARACTER")
 *
 * // This character gets +1 lore for each item you have in play
 * modifyStat("lore", { type: "items-in-play", controller: "you" }, "SELF", "permanent")
 * ```
 */
export function modifyStat(
  stat: "strength" | "willpower" | "lore",
  modifier: Amount,
  target: CharacterTarget | LocationTarget = "CHOSEN_CHARACTER",
  duration: "this-turn" | "permanent" = "this-turn",
): ModifyStatEffect {
  return {
    type: "modify-stat",
    stat,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Conditional effect (if/then/else)
 *
 * @param condition - The condition to check
 * @param then - Effect to execute if condition is true
 * @param elseEffect - Optional effect to execute if condition is false
 *
 * @example
 * ```typescript
 * // If you have no cards in your hand, draw a card
 * conditional(
 *   { type: "resource-count", what: "cards-in-hand", controller: "you", comparison: "equal", value: 0 },
 *   draw(1)
 * )
 * ```
 */
export function conditional(
  condition: Condition,
  then: Effect,
  elseEffect?: Effect,
): ConditionalEffect {
  return {
    type: "conditional",
    condition,
    then,
    ...(elseEffect && { else: elseEffect }),
  };
}

/**
 * Create an activated ability
 *
 * @param id - The ability ID (e.g., "1j9-1")
 * @param config - Configuration object
 * @param config.name - Optional ability name (ALL CAPS)
 * @param config.text - Full ability text
 * @param config.cost - Ability cost (exert, ink, etc.)
 * @param config.effect - Effect to execute
 *
 * @example
 * ```typescript
 * // {E} - Draw a card
 * activated("1j9-1", {
 *   name: "COMMAND",
 *   text: "COMMAND {E} — Draw a card.",
 *   cost: { exert: true },
 *   effect: draw(1)
 * })
 *
 * // {E}, 3 {I} — Deal 2 damage
 * activated("vmw-1", {
 *   name: "QUICK SHOT",
 *   text: "QUICK SHOT {E}, 3 {I} — Deal 2 damage to chosen character.",
 *   cost: { exert: true, ink: 3 },
 *   effect: dealDamage(2)
 * })
 * ```
 */
export function activated(
  id: string,
  config: {
    name?: string;
    text: string;
    cost: AbilityCost;
    effect: Effect;
  },
): AbilityDefinition {
  return {
    id,
    type: "activated",
    name: config.name,
    text: config.text,
    cost: config.cost,
    effect: config.effect,
  };
}

/**
 * Create a static ability
 *
 * @param id - The ability ID (e.g., "sj3-3")
 * @param config - Configuration object
 * @param config.name - Optional ability name (ALL CAPS)
 * @param config.text - Full ability text
 * @param config.effect - Static effect (modify-stat, gain-keyword, restriction, etc.)
 *
 * @example
 * ```typescript
 * // This character gets +1 lore for each item you have in play
 * staticAbility("sj3-3", {
 *   name: "GLAM",
 *   text: "GLAM This character gets +1 {L} for each item you have in play.",
 *   effect: modifyStat("lore", { type: "items-in-play", controller: "you" }, "SELF", "permanent")
 * })
 * ```
 */
export function staticAbility(
  id: string,
  config: {
    name?: string;
    text: string;
    effect: StaticEffect;
  },
): AbilityDefinition {
  return {
    id,
    type: "static",
    name: config.name,
    text: config.text,
    effect: config.effect,
  };
}

// ============================================================================
// Type Definitions
// ============================================================================

interface TriggeredAbilityConfig {
  name?: string;
  text: string;
  /**
   * Who plays the card
   * - "you" - you play (default)
   * - "opponent" - opponent plays
   */
  playedBy?: "you" | "opponent";
  /**
   * What card is played
   * - "SELF" - this character/card (default)
   * - Query object for filtering what card type/characteristics
   * @example { cardType: "character" }
   * @example { cardType: "character", classification: "Floodborn" }
   */
  playedCard?:
    | "SELF"
    | { cardType?: TriggerCardType; classification?: string; filters?: any[] };
  if?: any;
  then: any;
}
