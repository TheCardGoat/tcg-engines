/**
 * V2 Parser Type Definitions
 *
 * Re-exports types from @tcg/lorcana-types for use in the parser.
 * This allows the parser to work with proper types without depending
 * on the game engine.
 */

// Import Ability type for local use in interface definitions
import type { Ability as AbilityType } from "@tcg/lorcana-types";

// Re-export all types from @tcg/lorcana-types
export type {
  // Ability types
  Ability,
  // Cost types
  AbilityCost,
  AbilityDefinition,
  ActionAbility,
  ActionCard,
  ActivatedAbility,
  AndCondition,
  BanishEffect,
  CardTarget,
  // Card types
  CardType,
  CharacterCard,
  CharacterFilter,
  // Target types
  CharacterTarget,
  CharacterTargetEnum,
  CharacterTargetQuery,
  ChoiceEffect,
  Classification,
  ComparisonCondition,
  // Condition types
  Condition,
  ConditionalEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  // Effect types
  Effect,
  ExertEffect,
  ForEachEffect,
  GainKeywordEffect,
  GainLoreEffect,
  HasCharacterCountCondition,
  HasCharacterWithClassificationCondition,
  HasNamedCharacterCondition,
  IfCondition,
  InInkwellCondition,
  // Ink and classification
  InkType,
  InPlayCondition,
  ItemCard,
  ItemTarget,
  KeywordAbility,
  KeywordType,
  LocationCard,
  LocationTarget,
  LorcanaCard,
  LorcanaCardDefinition,
  LoseLoreEffect,
  ModifyStatEffect,
  MoveToLocationEffect,
  OptionalEffect,
  OrCondition,
  ParameterizedKeywordType,
  PlayCardEffect,
  PlayerChoiceCondition,
  PlayerTarget,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  ReadyEffect,
  RemoveDamageEffect,
  RepeatEffect,
  ReplacementAbility,
  ResolutionCondition,
  ResourceCountCondition,
  Restriction,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  RevealHandEffect,
  RevealTopCardEffect,
  // Scry effect types
  ScryCardFilter,
  ScryDestination,
  ScryEffect,
  SearchDeckEffect,
  SequenceEffect,
  ShuffleIntoDeckEffect,
  SimpleKeywordType,
  StaticAbility,
  StaticEffect,
  ThisTurnHappenedCondition,
  // Trigger types
  Trigger,
  TriggerEvent,
  TriggeredAbility,
  TriggerSubject,
  TriggerTiming,
  ValueKeywordType,
} from "@tcg/lorcana-types";

/**
 * Ability with original text preserved
 *
 * Extends the base Ability type with the original card text
 * and optional name for named abilities.
 */
export interface AbilityWithText {
  ability: AbilityType;
  /** Original card text for this ability (optional) */
  text?: string;
  /**
   * Named ability prefix (ALL CAPS text before the effect)
   * e.g., "DARK KNOWLEDGE" from "DARK KNOWLEDGE Whenever this character quests..."
   */
  name?: string;
  /**
   * Unique identifier for this ability instance
   * Generated when generateAbilityUids option is enabled
   * Format: "{cardId}-{index}" (e.g., "17t-1", "17t-2")
   */
  id?: string;
}

/**
 * Result of parsing a single ability text
 */
export interface ParseResult {
  /** Whether parsing succeeded */
  success: boolean;

  /** Parsed ability (if successful or partially successful) */
  ability?: AbilityWithText | null;

  /**
   * Non-fatal warnings encountered during parsing
   * e.g., "Unknown keyword", "Unrecognized condition"
   */
  warnings?: string[];

  /**
   * Fatal error message (if success is false)
   */
  error?: string;

  /**
   * Segments of text that could not be parsed
   * Useful for iterative improvement
   */
  unparsedSegments?: string[];
}

/**
 * Result of batch processing multiple ability texts
 */
export interface BatchParseResult {
  /** Total number of texts processed */
  total: number;

  /** Number of successful parses */
  successful: number;

  /** Number of failed parses */
  failed: number;

  /** Individual parse results */
  results: ParseResult[];
}

/**
 * Options for parsing behavior
 */
export interface ParserOptions {
  /**
   * Strict mode - fail on any warning
   * Default: false (lenient mode)
   */
  strict?: boolean;

  /**
   * Resolve {d} placeholders to 0
   * Default: false (preserve placeholders)
   */
  resolveNumbers?: boolean;

  /**
   * Context: Name of the card being parsed
   * Used for manual override lookups by card name
   */
  cardName?: string;
}

// Re-export utility functions
export {
  actionAbility,
  activated,
  // Common triggers
  COMMON_TRIGGERS,
  challenger,
  exertAndInkCost,
  // Cost utilities
  exertCost,
  isActionAbility,
  isActionCard,
  isActivatedAbility,
  isCharacterCard,
  isItemCard,
  // Type guards
  isKeywordAbility,
  isLocationCard,
  isReplacementAbility,
  isStaticAbility,
  isTriggeredAbility,
  // Builders
  keyword,
  resist,
  shift,
  singer,
  staticAbility,
  triggered,
} from "@tcg/lorcana-types";
