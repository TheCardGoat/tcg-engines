/**
 * Legacy Ability Type Definitions
 *
 * Type definitions for the legacy @lorcanito/lorcana-engine format.
 * These types describe the structure of abilities found in legacy-cards/.
 */

// ============================================================================
// Legacy Card Types
// ============================================================================

/**
 * Base properties shared by all legacy card types
 */
export interface LegacyCardBase {
  /** Unique card identifier (e.g., "d6b", "ub4") */
  id: string;
  /** Alternative card IDs for reprints */
  reprints?: string[];
  /** Card name (e.g., "Ariel", "Smash") */
  name: string;
  /** Card characteristics (e.g., ["hero", "storyborn", "princess"]) */
  characteristics: string[];
  /** Full card text as printed */
  text: string;
  /** Card type */
  type: "character" | "action" | "item" | "song";
  /** Flavour text */
  flavour?: string;
  /** Whether this can be inked (placed in inkwell) */
  inkwell: boolean;
  /** Ink colors (e.g., ["amber"], ["steel", "ruby"]) */
  colors: string[];
  /** Cost to play */
  cost: number;
  /** Illustrator name */
  illustrator: string;
  /** Card number within set */
  number: number;
  /** Set identifier (e.g., "TFC", "RDF") */
  set: string;
  /** External IDs (TCGPlayer, etc.) */
  externalIds?: {
    tcgPlayer?: number;
    ravensburger?: string;
  };
  /** Card rarity */
  rarity?: string;
  /** Abilities array */
  abilities: LegacyAbility[];
}

/**
 * Legacy character card
 */
export interface LegacyCharacterCard extends LegacyCardBase {
  type: "character";
  /** Version title (e.g., "On Human Legs") */
  title: string;
  /** Strength value */
  strength: number;
  /** Willpower value */
  willpower: number;
  /** Lore value gained when questing */
  lore: number;
}

/**
 * Legacy action card (includes songs)
 */
export interface LegacyActionCard extends LegacyCardBase {
  type: "action";
}

/**
 * Legacy item card
 */
export interface LegacyItemCard extends LegacyCardBase {
  type: "item";
  /** Optional: Version title for items */
  title?: string;
  /** Optional: Durability for some items */
  durability?: number;
}

/**
 * Union type for all legacy cards
 */
export type LegacyCard =
  | LegacyCharacterCard
  | LegacyActionCard
  | LegacyItemCard;

// ============================================================================
// Legacy Ability Types
// ============================================================================

/**
 * Any legacy ability (helper function result or inline object)
 */
export type LegacyAbility =
  | LegacyInlineAbility
  | LegacyKeywordHelperResult
  | LegacyWhenHelperResult;

/**
 * Inline ability object (not a helper function)
 */
export interface LegacyInlineAbility {
  /** Ability type */
  type: "resolution" | "activated" | "static";
  /** Optional named ability title (in ALL CAPS) */
  name?: string;
  /** Ability text */
  text?: string;
  /** Costs (for activated abilities) */
  costs?: LegacyCost[];
  /** Effects array */
  effects?: LegacyEffect[];
  /** Static keyword ability (e.g., "singer") */
  ability?: string;
  /** Value for keyword abilities (e.g., Singer value) */
  value?: number;
  /** Optional flag for triggered abilities */
  optional?: boolean;
}

/**
 * Result of a keyword helper function (e.g., voicelessAbility, bodyguardAbility)
 * These are typically imported from @lorcanito/lorcana-engine/abilities/abilities
 */
export interface LegacyKeywordHelperResult {
  /** Function name that created this */
  _helperName:
    | "voicelessAbility"
    | "bodyguardAbility"
    | "evasiveAbility"
    | "wardAbility"
    | "rushAbility"
    | "recklessAbility"
    | "supportAbility";
  /** Function arguments */
  _helperArgs: unknown[];
  /** The actual ability structure */
  ability: LegacyInlineAbility;
}

/**
 * Result of a when/whenever helper function
 * e.g., whenYouPlayThisCharAbility({...})
 * These are typically imported from @lorcanito/lorcana-engine/abilities/whenAbilities
 */
export interface LegacyWhenHelperResult {
  /** Function name that created this */
  _helperName:
    | "whenYouPlayThisCharAbility"
    | "wheneverThisCharacterQuests"
    | "atStartOfTurn"
    | "whenThisCharacterChallenges"
    | "whenCharacterIsBanished";
  /** The wrapped ability */
  ability: LegacyInlineAbility;
}

// ============================================================================
// Legacy Cost Types
// ============================================================================

/**
 * Legacy cost for activated abilities
 */
export type LegacyCost =
  | { type: "exert" }
  | { type: "ink"; amount?: number }
  | { type: "banish"; target?: string }
  | { type: "damage"; amount: number };

// ============================================================================
// Legacy Effect Types
// ============================================================================

/**
 * Legacy effect types
 */
export type LegacyEffect =
  | LegacyScryEffect
  | LegacyHealEffect
  | LegacyDamageEffect
  | LegacyBanishEffect
  | LegacyDrawEffect
  | LegacyMoveEffect
  | LegacyExertEffect
  | LegacyReadyEffect
  | LegacyGainKeywordEffect
  | LegacyModifyStatEffect
  | LegacyRestrictionEffect
  | LegacyLoseLoreEffect
  | LegacyGainLoreEffect;

/**
 * Look at cards from deck (scry)
 */
export interface LegacyScryEffect {
  type: "scry";
  /** Number of cards to look at */
  amount: number;
  /** Where to put cards: "bottom", "top", "hand" */
  mode?: string;
  /** Whether to reveal tutored card */
  shouldRevealTutored?: boolean;
  /** Target (usually "self" or controller) */
  target: LegacyTarget | "self";
  /** Limits on where cards can go */
  limits?: {
    bottom?: number;
    top?: number;
    inkwell?: number;
    hand?: number;
  };
  /** Filters for finding specific cards to tutor */
  tutorFilters?: LegacyFilter[];
}

/**
 * Remove damage (heal)
 */
export interface LegacyHealEffect {
  type: "heal";
  /** Amount of damage to remove */
  amount: number;
  /** "up to" - optional healing */
  upTo?: boolean;
  /** Target to heal */
  target: LegacyTarget;
}

/**
 * Deal damage
 */
export interface LegacyDamageEffect {
  type: "damage";
  /** Amount of damage to deal */
  amount: number;
  /** Target to damage */
  target: LegacyTarget;
}

/**
 * Banish cards
 */
export interface LegacyBanishEffect {
  type: "banish";
  /** Target to banish */
  target: LegacyTarget;
  /** Optional: where to banish to */
  destination?: "discard" | "zone";
}

/**
 * Draw cards
 */
export interface LegacyDrawEffect {
  type: "draw";
  /** Number of cards to draw */
  amount: number;
  /** Who draws */
  target: "self" | "opponent" | LegacyTarget;
}

/**
 * Move card between zones
 */
export interface LegacyMoveEffect {
  type: "move";
  /** Target card to move */
  target: LegacyTarget;
  /** Source zone */
  from?: string;
  /** Destination zone */
  to: string;
  /** Optional: owner restriction */
  owner?: "self" | "opponent";
}

/**
 * Exert a card
 */
export interface LegacyExertEffect {
  type: "exert";
  /** Target to exert */
  target: LegacyTarget;
}

/**
 * Ready a card
 */
export interface LegacyReadyEffect {
  type: "ready";
  /** Target to ready */
  target: LegacyTarget;
}

/**
 * Grant keyword ability
 */
export interface LegacyGainKeywordEffect {
  type: "ability";
  /** Keyword to grant */
  keyword: string;
  /** Target that gains keyword */
  target: LegacyTarget;
  /** Optional value for parameterized keywords */
  value?: number;
}

/**
 * Modify stat (strength/willpower/lore)
 */
export interface LegacyModifyStatEffect {
  type: "attribute";
  /** Stat to modify */
  stat: "strength" | "willpower" | "lore";
  /** Amount to modify (can be negative) */
  amount: number;
  /** Target to modify */
  target: LegacyTarget;
}

/**
 * Restriction effect
 */
export interface LegacyRestrictionEffect {
  type: "restriction";
  /** Restriction type */
  restriction: string;
  /** What is restricted */
  target?: LegacyTarget;
}

/**
 * Lose lore
 */
export interface LegacyLoseLoreEffect {
  type: "loseLore";
  /** Amount of lore to lose */
  amount: number;
  /** Target player */
  target: "self" | "opponent";
}

/**
 * Gain lore
 */
export interface LegacyGainLoreEffect {
  type: "gainLore";
  /** Amount of lore to gain */
  amount: number;
  /** Target player */
  target: "self" | "opponent";
}

// ============================================================================
// Legacy Target Types
// ============================================================================

/**
 * Legacy target specification
 */
export interface LegacyTarget {
  type: "card" | "player";
  /** Number of targets: 1, "all", or specific number */
  value: number | "all";
  /** Filters to limit what can be targeted */
  filters?: LegacyFilter[];
}

/**
 * Legacy filter for target selection
 */
export type LegacyFilter =
  | ZoneFilter
  | OwnerFilter
  | TypeFilter
  | CharacteristicsFilter
  | InkColorFilter
  | DamageFilter
  | ChallengerFilter;

export interface ZoneFilter {
  filter: "zone";
  value: "play" | "hand" | "deck" | "discard" | "inkwell";
}

export interface OwnerFilter {
  filter: "owner";
  value: "self" | "opponent";
}

export interface TypeFilter {
  filter: "type";
  value: "character" | "action" | "item";
}

export interface CharacteristicsFilter {
  filter: "characteristics";
  value: string[];
}

export interface InkColorFilter {
  filter: "inkColor";
  value: string[];
}

export interface DamageFilter {
  filter: "damage";
  value: "damaged" | "undamaged";
}

export interface ChallengerFilter {
  filter: "challenger";
  value: boolean;
}

// ============================================================================
// Legacy Helper Function Signatures
// ============================================================================

/**
 * Known legacy helper functions from @lorcanito/lorcana-engine/abilities/abilities
 */
export interface LegacyHelperSignatures {
  /** Voiceless - prevents singing */
  voicelessAbility(): LegacyKeywordHelperResult;

  /** Bodyguard keyword */
  bodyguardAbility(): LegacyKeywordHelperResult;

  /** Evasive keyword */
  evasiveAbility(): LegacyKeywordHelperResult;

  /** Ward keyword */
  wardAbility(): LegacyKeywordHelperResult;

  /** Rush keyword */
  rushAbility(): LegacyKeywordHelperResult;

  /** Reckless keyword */
  recklessAbility(): LegacyKeywordHelperResult;

  /** Support keyword */
  supportAbility(): LegacyKeywordHelperResult;

  /** Singer keyword with value */
  singerAbility(value: number): LegacyKeywordHelperResult;

  /** Shift keyword with cost and optional target name */
  shiftAbility(cost: number, target?: string): LegacyKeywordHelperResult;
}

/**
 * Known legacy when/whenever helper functions
 * from @lorcanito/lorcana-engine/abilities/whenAbilities
 */
export interface LegacyWhenHelperSignatures {
  /** When you play this character */
  whenYouPlayThisCharAbility(
    ability: LegacyInlineAbility,
  ): LegacyWhenHelperResult;

  /** Whenever this character quests */
  wheneverThisCharacterQuests(
    ability: LegacyInlineAbility,
  ): LegacyWhenHelperResult;

  /** At the start of your turn */
  atStartOfTurn(ability: LegacyInlineAbility): LegacyWhenHelperResult;

  /** When this character challenges */
  whenThisCharacterChallenges(
    ability: LegacyInlineAbility,
  ): LegacyWhenHelperResult;

  /** When a character is banished */
  whenCharacterIsBanished(ability: LegacyInlineAbility): LegacyWhenHelperResult;
}

/**
 * Known legacy target helpers from @lorcanito/lorcana-engine/abilities/targets
 */
export interface LegacyTargetHelpers {
  /** Self/this card */
  self: "self";

  /** Opponent */
  opponent: "opponent";
}
