import type { BaseContext, PlayerTargetDSL, TargetDSL } from "./target-dsl";
import type {
  CardFilter as CanonicalCardFilter,
  CardStatus,
  ClassificationFilterExpr as HasClassificationFilter,
  ComparisonOperator,
  CostFilterExpr as CostFilter,
  CurrentTurnPlayerFilterExpr,
  FilterExpr,
  FloodbornFilterExpr,
  InkableFilterExpr as InkableFilter,
  KeywordFilterExpr as HasKeywordFilter,
  LoreFilterExpr as LoreValueFilter,
  MoveCostFilterExpr as MoveCostFilter,
  NameFilterExpr as NameFilter,
  PlayerFilter as CanonicalPlayerFilter,
  SongFilterExpr,
  StatusFilterExpr as StatusFilter,
  StrengthFilterExpr as StrengthFilter,
  WillpowerFilterExpr as WillpowerFilter,
  ZoneCountRankPlayerFilterExpr,
  AtLocationFilterExpr as AtLocationFilter,
  CardsUnderFilterExpr as CardsUnderFilter,
  CardTypeFilterExpr,
  ChallengeRoleFilterExpr,
  ChallengedThisTurnFilterExpr,
  OwnerFilterExpr,
  SameLocationAsSourceFilterExpr,
  SourceFilterExpr,
  UnderParentFilterExpr,
  ZoneFilterExpr,
} from "../expressions";

/** Lorcana zone IDs */
export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo";

export type LorcanaFilter = CanonicalCardFilter;
export type LorcanaPlayerFilter = CanonicalPlayerFilter;

export type DamagedFilter = StatusFilter & { status: "damaged" };
export type UndamagedFilter = StatusFilter & { status: "undamaged" };
export type ExertedFilter = StatusFilter & { status: "exerted" };
export type ReadyFilter = StatusFilter & { status: "ready" };
export type DryFilter = StatusFilter & { status: "dry" };
export type CardTypeFilter = CardTypeFilterExpr;

// ============================================================================
// Lorcana Context References
// ============================================================================

/**
 * Context references for Lorcana abilities
 *
 * These allow effects to reference cards based on the current context
 * rather than requiring explicit targeting.
 */
export interface LorcanaContext extends BaseContext {
  /** Reference the source card itself */
  self?: boolean;

  /** Reference the card that triggered this ability */
  triggerSource?: boolean;

  /** Reference the attacker in a challenge */
  attacker?: boolean;

  /** Reference the defender in a challenge */
  defender?: boolean;

  /** Reference the previously selected target in an effect chain */
  previousTarget?: boolean;

  /** Reference the singer in a song */
  singer?: boolean;

  /** Reference the song being sung */
  song?: boolean;

  /**
   * Resolution context for resolution conditions
   * Used for checking if we are currently resolving a specific mechanic (e.g. Bodyguard)
   */
  resolutionContext?: "bodyguard" | "shift" | string;

  /** Reference cards revealed by an effect (e.g. "Look at the top card of your deck") */
  revealedCards?: string[];

  /**
   * Recursion depth tracking for condition evaluation
   * Prevents infinite loops in recursive condition checks
   * @internal
   */
  recursionDepth?: number;
}

// ============================================================================
// Lorcana Card Types
// ============================================================================

/**
 * Lorcana card types for targeting
 */
export type LorcanaCardType = "character" | "item" | "location" | "action";

// ============================================================================
// Lorcana Target DSL
// ============================================================================

/**
 * Lorcana card target - extends core DSL with Lorcana-specific features
 *
 * @example Target a chosen opposing damaged character
 * ```typescript
 * const target: LorcanaCardTarget = {
 *   selector: "chosen",
 *   count: 1,
 *   owner: "opponent",
 *   cardType: "character",
 *   zones: ["play"],
 *   filters: [{ type: "status", status: "damaged" }]
 * };
 * ```
 *
 * @example Target all your characters with Evasive
 * ```typescript
 * const target: LorcanaCardTarget = {
 *   selector: "all",
 *   owner: "you",
 *   cardType: "character",
 *   zones: ["play"],
 *   filters: [{ type: "keyword", keyword: "Evasive" }]
 * };
 * ```
 */
export interface LorcanaCardTarget extends TargetDSL<
  LorcanaFilter | LorcanaFilter[],
  LorcanaContext
> {
  /** Lorcana card type constraint */
  cardType?: LorcanaCardType;

  /** Override zones with Lorcana-specific zone IDs */
  zones?: LorcanaZoneId[];

  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: LorcanaFilter | LorcanaFilter[];

  /** Lorcana-specific filters */
  filters?: readonly LorcanaFilter[];

  /** Resolve candidates directly from the current action context */
  reference?: LorcanaTargetReference;
}

// ============================================================================
// Convenience Type Aliases
// ============================================================================

/**
 * Character target (card type constrained)
 */
export type CharacterTarget = LorcanaCardTarget & { cardType: "character" };

/**
 * Item target (card type constrained)
 */
export type ItemTarget = LorcanaCardTarget & { cardType: "item" };

/**
 * Location target (card type constrained)
 */
export type LocationTarget = LorcanaCardTarget & { cardType: "location" };

// ============================================================================
// Player Targeting (re-export with Lorcana context)
// ============================================================================

export type LorcanaTargetReference =
  | "source"
  | "trigger-subject"
  | "selected-first"
  | "selected-all"
  | "revealed-first"
  | "revealed-all"
  | "chosen-or-source"
  | "singers";

/**
 * Lorcana player target (extends core player selector with filters).
 */
export interface LorcanaPlayerTarget extends PlayerTargetDSL {
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: LorcanaPlayerFilter | LorcanaPlayerFilter[];
  filters?: readonly LorcanaPlayerFilter[];
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a target is a DSL object (vs enum string)
 */
export function isDSLTarget(target: LorcanaTarget): target is LorcanaCardTarget {
  return typeof target === "object" && target !== null;
}

export function isLorcanaPlayerTarget(target: unknown): target is LorcanaPlayerTarget {
  if (typeof target !== "object" || target === null || Array.isArray(target)) {
    return false;
  }

  const selector = (target as { selector?: unknown }).selector;
  return (
    selector === "you" ||
    selector === "opponent" ||
    selector === "each-player" ||
    selector === "chosen"
  );
}

/**
 * Check if a filter is a state filter
 */
export function isStateFilter(
  filter: LorcanaFilter,
): filter is
  | StatusFilter
  | DamagedFilter
  | UndamagedFilter
  | ExertedFilter
  | ReadyFilter
  | DryFilter {
  if (filter.type === "status") {
    return (
      filter.status === "damaged" ||
      filter.status === "undamaged" ||
      filter.status === "exerted" ||
      filter.status === "ready" ||
      filter.status === "dry"
    );
  }

  return false;
}

/**
 * Check if a filter is a numeric comparison filter
 */
export function isNumericFilter(
  filter: LorcanaFilter,
): filter is StrengthFilter | WillpowerFilter | CostFilter | LoreValueFilter | MoveCostFilter {
  return (
    filter.type === "strength" ||
    filter.type === "willpower" ||
    filter.type === "cost" ||
    filter.type === "lore" ||
    filter.type === "move-cost"
  );
}

// ============================================================================
// Enum Shortcuts (defined here, expanded in enum-expansion.ts)
// ============================================================================

/**
 * Character target enum shortcuts
 *
 * These provide syntactic sugar for common targeting patterns.
 * Use these for simple cases, use LorcanaCardTarget for complex cases.
 */
export type CharacterTargetEnum =
  // Self-referential
  | "SELF"
  | "THIS_CHARACTER"

  // Chosen (requires player choice)
  | "CHOSEN_CHARACTER"
  | "CHOSEN_OPPOSING_CHARACTER"
  | "CHOSEN_CHARACTER_OF_YOURS"
  | "ANOTHER_CHOSEN_CHARACTER"
  | "ANOTHER_CHOSEN_CHARACTER_OF_YOURS"

  // All/Each (affects multiple)
  | "ALL_CHARACTERS"
  | "ALL_OPPOSING_CHARACTERS"
  | "YOUR_CHARACTERS"
  | "YOUR_OTHER_CHARACTERS"
  | "EACH_CHARACTER"
  | "EACH_OPPOSING_CHARACTER"

  // Damaged variants
  | "CHOSEN_DAMAGED_CHARACTER"
  | "CHOSEN_OPPOSING_DAMAGED_CHARACTER"
  | "ALL_OPPOSING_DAMAGED_CHARACTERS";

/**
 * Item target enum shortcuts
 */
export type ItemTargetEnum =
  | "CHOSEN_ITEM"
  | "CHOSEN_OPPOSING_ITEM"
  | "YOUR_ITEMS"
  | "ALL_ITEMS"
  | "ALL_OPPOSING_ITEMS"
  | "THIS_ITEM";

/**
 * Location target enum shortcuts
 */
export type LocationTargetEnum =
  | "CHOSEN_LOCATION"
  | "CHOSEN_OPPOSING_LOCATION"
  | "YOUR_LOCATIONS"
  | "ALL_OPPOSING_LOCATIONS"
  | "THIS_LOCATION";

// ============================================================================
// Union Types (enum OR DSL)
// ============================================================================

/**
 * Character target: either an enum shortcut or full DSL
 */
export type LorcanaCharacterTarget = CharacterTargetEnum | CharacterTarget;

/**
 * Item target: either an enum shortcut or full DSL
 */
export type LorcanaItemTarget = ItemTargetEnum | ItemTarget;

/**
 * Location target: either an enum shortcut or full DSL
 */
export type LorcanaLocationTarget = LocationTargetEnum | LocationTarget;

/**
 * Any card target
 */
export type LorcanaTarget =
  | LorcanaCharacterTarget
  | LorcanaItemTarget
  | LorcanaLocationTarget
  | LorcanaCardTarget;

/**
 * Runtime enumeration target DSL for Lorcana moves.
 *
 * Includes both card and player targeting, replacing legacy wrapper
 * shapes from older move input definitions.
 */
export type LorcanaTargetDSL = LorcanaCardTarget | LorcanaPlayerTarget;
