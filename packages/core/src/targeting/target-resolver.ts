/**
 * Target Resolution - Interfaces for resolving DSL to actual card selections
 *
 * This module defines the contracts that game engines implement to
 * resolve target DSL specifications into actual card selections.
 *
 * @module targeting/target-resolver
 */

import type { CardInstance } from "../cards/card-instance";
import type { PlayerId } from "../types";
import type {
  BaseContext,
  TargetCount,
  TargetDSL,
  TargetingUIHint,
} from "./target-dsl";

// ============================================================================
// Resolution Context
// ============================================================================

/**
 * Context provided during target resolution
 *
 * Contains all information needed to evaluate targeting constraints.
 * Game engines extend this with game-specific context.
 *
 * @typeParam TGameState - The game state type
 * @typeParam TCard - The card instance type
 */
export interface TargetResolutionContext<
  TGameState,
  TCard extends CardInstance<unknown>,
> {
  /** Current game state */
  state: TGameState;

  /** The card that is the source of targeting (if any) */
  sourceCard?: TCard;

  /** The player performing the targeting action */
  sourcePlayer: PlayerId;

  /** Previously selected targets (for multi-target validation) */
  previousTargets?: TCard[];

  /**
   * Game-specific context extensions
   * Games add properties like triggerSource, attacker, defender, etc.
   */
  [key: string]: unknown;
}

// ============================================================================
// Target Resolver Interface
// ============================================================================

/**
 * Interface for target resolution implementations
 *
 * Game engines implement this to provide targeting logic specific to their rules.
 *
 * @typeParam TGameState - The game state type
 * @typeParam TCard - The card instance type
 * @typeParam TTarget - The target DSL type (game-specific extension)
 */
export interface TargetResolver<
  TGameState,
  TCard extends CardInstance<unknown>,
  TTarget extends TargetDSL,
> {
  /**
   * Get all valid targets matching the DSL specification
   *
   * @param target - Target DSL specification
   * @param context - Resolution context
   * @returns Array of cards that are valid targets
   */
  getValidTargets(
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TCard[];

  /**
   * Check if a specific card is a valid target
   *
   * @param card - Card to check
   * @param target - Target DSL specification
   * @param context - Resolution context
   * @returns true if the card is a valid target
   */
  isValidTarget(
    card: TCard,
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): boolean;

  /**
   * Validate a target selection
   *
   * @param selectedTargets - Cards selected by the player
   * @param target - Target DSL specification
   * @param context - Resolution context
   * @returns Validation result with error message if invalid
   */
  validateSelection(
    selectedTargets: TCard[],
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TargetValidationResult;

  /**
   * Get UI hints for target selection interface
   *
   * @param target - Target DSL specification
   * @param context - Resolution context
   * @returns UI hints for rendering selection interface
   */
  getTargetingUI(
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TargetingUIHint;
}

// ============================================================================
// Validation Result
// ============================================================================

/**
 * Result of target selection validation
 */
export interface TargetValidationResult {
  /** Whether the selection is valid */
  valid: boolean;

  /** Error message if invalid */
  error?: string;

  /** Specific issues with individual targets */
  issues?: TargetIssue[];
}

/**
 * Issue with a specific target in a selection
 */
export interface TargetIssue {
  /** Index of the problematic target */
  index: number;

  /** ID of the problematic card */
  cardId: string;

  /** Description of the issue */
  reason: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a successful validation result
 */
export function validSelection(): TargetValidationResult {
  return { valid: true };
}

/**
 * Create a failed validation result
 */
export function invalidSelection(
  error: string,
  issues?: TargetIssue[],
): TargetValidationResult {
  return { valid: false, error, issues };
}

/**
 * Validate target count against a specification
 */
export function validateTargetCount(
  selectedCount: number,
  targetCount: TargetCount | undefined,
  availableCount: number,
): TargetValidationResult {
  // Default to exactly 1 if not specified
  const count = targetCount ?? 1;

  if (count === "all") {
    // "all" is valid as long as we selected all available
    // (or the player selected what they could)
    return validSelection();
  }

  if (typeof count === "number") {
    if (selectedCount !== count) {
      // Check if there weren't enough available
      if (availableCount < count) {
        return invalidSelection(
          `Expected ${count} target(s) but only ${availableCount} available`,
        );
      }
      return invalidSelection(
        `Expected exactly ${count} target(s), but got ${selectedCount}`,
      );
    }
    return validSelection();
  }

  if ("exactly" in count) {
    if (selectedCount !== count.exactly) {
      return invalidSelection(
        `Expected exactly ${count.exactly} target(s), but got ${selectedCount}`,
      );
    }
    return validSelection();
  }

  if ("upTo" in count) {
    if (selectedCount > count.upTo) {
      return invalidSelection(
        `Expected at most ${count.upTo} target(s), but got ${selectedCount}`,
      );
    }
    return validSelection();
  }

  if ("atLeast" in count) {
    if (selectedCount < count.atLeast) {
      return invalidSelection(
        `Expected at least ${count.atLeast} target(s), but got ${selectedCount}`,
      );
    }
    return validSelection();
  }

  if ("between" in count) {
    const [min, max] = count.between;
    if (selectedCount < min) {
      return invalidSelection(
        `Expected at least ${min} target(s), but got ${selectedCount}`,
      );
    }
    if (selectedCount > max) {
      return invalidSelection(
        `Expected at most ${max} target(s), but got ${selectedCount}`,
      );
    }
    return validSelection();
  }

  return validSelection();
}

// ============================================================================
// Abstract Base Resolver
// ============================================================================

/**
 * Abstract base class for target resolvers
 *
 * Provides common functionality that game-specific resolvers can extend.
 *
 * @typeParam TGameState - The game state type
 * @typeParam TCard - The card instance type
 * @typeParam TTarget - The target DSL type
 * @typeParam TContext - The context type
 */
export abstract class BaseTargetResolver<
  TGameState,
  TCard extends CardInstance<unknown>,
  TTarget extends TargetDSL<any, any>,
  TContext extends BaseContext = BaseContext,
> implements TargetResolver<TGameState, TCard, TTarget>
{
  /**
   * Get all cards in specified zones
   * Game engines override this to access their zone system
   */
  protected abstract getCardsInZones(
    zones: string[] | undefined,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TCard[];

  /**
   * Check if a card matches ownership constraints
   */
  protected abstract matchesOwnership(
    card: TCard,
    owner: "you" | "opponent" | "any" | undefined,
    context: TargetResolutionContext<TGameState, TCard>,
  ): boolean;

  /**
   * Check if a card matches card type constraints
   */
  protected abstract matchesCardType(
    card: TCard,
    cardTypes: string[] | undefined,
    context: TargetResolutionContext<TGameState, TCard>,
  ): boolean;

  /**
   * Apply game-specific filters to a card
   */
  protected abstract applyFilter(
    card: TCard,
    filter: unknown,
    context: TargetResolutionContext<TGameState, TCard>,
  ): boolean;

  /**
   * Generate human-readable description of the target
   */
  protected abstract generateDescription(target: TTarget): string;

  getValidTargets(
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TCard[] {
    // Handle self selector
    if (target.selector === "self" && context.sourceCard) {
      return [context.sourceCard];
    }

    // Get all cards in specified zones
    let candidates = this.getCardsInZones(target.zones, context);

    // Apply ownership filter
    candidates = candidates.filter((card) =>
      this.matchesOwnership(card, target.owner, context),
    );

    // Apply card type filter
    candidates = candidates.filter((card) =>
      this.matchesCardType(card, target.cardTypes, context),
    );

    // Apply game-specific filter
    if (target.filter) {
      candidates = candidates.filter((card) =>
        this.applyFilter(card, target.filter, context),
      );
    }

    // Handle excludeSelf
    if (target.excludeSelf && context.sourceCard) {
      candidates = candidates.filter(
        (card) => card.id !== context.sourceCard!.id,
      );
    }

    // Handle different targets requirement
    if (target.requireDifferentTargets && context.previousTargets) {
      const previousIds = new Set(context.previousTargets.map((c) => c.id));
      candidates = candidates.filter((card) => !previousIds.has(card.id));
    }

    return candidates;
  }

  isValidTarget(
    card: TCard,
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): boolean {
    const validTargets = this.getValidTargets(target, context);
    return validTargets.some((t) => t.id === card.id);
  }

  validateSelection(
    selectedTargets: TCard[],
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TargetValidationResult {
    const validTargets = this.getValidTargets(target, context);

    // Validate count
    const countResult = validateTargetCount(
      selectedTargets.length,
      target.count,
      validTargets.length,
    );
    if (!countResult.valid) {
      return countResult;
    }

    // Validate each selected target is valid
    const issues: TargetIssue[] = [];
    for (let i = 0; i < selectedTargets.length; i++) {
      const selected = selectedTargets[i];
      if (!selected) {
        issues.push({
          index: i,
          cardId: "undefined",
          reason: "Target is undefined",
        });
        continue;
      }

      if (!validTargets.some((t) => t.id === selected.id)) {
        issues.push({
          index: i,
          cardId: String(selected.id),
          reason: "Not a valid target",
        });
      }
    }

    if (issues.length > 0) {
      return invalidSelection("Some selected targets are invalid", issues);
    }

    // Check for duplicates if required
    if (target.requireDifferentTargets) {
      const ids = selectedTargets.map((t) => t.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        return invalidSelection("All targets must be different cards");
      }
    }

    return validSelection();
  }

  getTargetingUI(
    target: TTarget,
    context: TargetResolutionContext<TGameState, TCard>,
  ): TargetingUIHint {
    const validTargets = this.getValidTargets(target, context);

    // Determine selection type
    let selectionType: TargetingUIHint["selectionType"];
    if (target.selector === "self") {
      selectionType = "none";
    } else if (target.selector === "all" || target.selector === "each") {
      selectionType = "automatic";
    } else if (target.selector === "chosen") {
      const maxCount =
        target.count === "all"
          ? validTargets.length
          : typeof target.count === "number"
            ? target.count
            : target.count && "upTo" in target.count
              ? target.count.upTo
              : 1;
      selectionType = maxCount > 1 ? "multiple" : "single";
    } else {
      selectionType = "single";
    }

    // Calculate min/max
    let minSelections = 1;
    let maxSelections: number | "unlimited" = 1;

    if (target.count === "all") {
      minSelections = validTargets.length;
      maxSelections = validTargets.length;
    } else if (typeof target.count === "number") {
      minSelections = target.count;
      maxSelections = target.count;
    } else if (target.count && "upTo" in target.count) {
      minSelections = 0;
      maxSelections = target.count.upTo;
    } else if (target.count && "atLeast" in target.count) {
      minSelections = target.count.atLeast;
      maxSelections = "unlimited";
    } else if (target.count && "between" in target.count) {
      minSelections = target.count.between[0];
      maxSelections = target.count.between[1];
    } else if (target.count && "exactly" in target.count) {
      minSelections = target.count.exactly;
      maxSelections = target.count.exactly;
    }

    return {
      selectionType,
      minSelections,
      maxSelections,
      prompt: this.generateDescription(target),
      optional: minSelections === 0,
      highlightZones: target.zones || [],
    };
  }
}
