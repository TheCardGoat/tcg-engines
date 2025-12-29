import type { CardDefinition } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import { matchesFilter } from "../filtering/filter-matching";
import type { CardRegistry } from "../operations/card-registry";
import type { PlayerId } from "../types";
import type { TargetDefinition } from "./target-definition";

/**
 * Context for target validation
 * Provides information needed to evaluate targeting restrictions
 * @template TCustomState - The custom state type for CardInstance
 */
export type TargetContext<TCustomState = unknown> = {
  /** The card that is the source of the targeting (e.g., the spell being cast) */
  sourceCard: CardInstance<TCustomState>;

  /** The player controlling the targeting action */
  controller: PlayerId;

  /** Previously selected targets (for multi-target validation) */
  previousTargets: CardInstance<TCustomState>[];
};

/**
 * Result of target validation
 */
export type ValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Check if a card is a legal target for a given target definition
 * @template TCustomState - The custom state type for CardInstance
 * @template TGameState - The game state type
 * @param card - The potential target card
 * @param targetDef - Target definition specifying requirements
 * @param state - Game state for filter evaluation
 * @param registry - Card definition registry
 * @param context - Target context (source, controller, previous targets)
 * @returns true if the card is a legal target
 */
export function isLegalTarget<
  TCustomState = unknown,
  TGameState extends { cards: Record<string, CardInstance<TCustomState>> } = {
    cards: Record<string, CardInstance<TCustomState>>;
  },
>(
  card: CardInstance<TCustomState>,
  targetDef: TargetDefinition,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
  context: TargetContext<TCustomState>,
): boolean {
  // Check if card matches the filter
  if (!matchesFilter(card, targetDef.filter, state, registry)) {
    return false;
  }

  // Check targeting restrictions
  if (targetDef.restrictions) {
    for (const restriction of targetDef.restrictions) {
      if (restriction === "not-self") {
        if (card.id === context.sourceCard.id) {
          return false;
        }
      }

      if (restriction === "not-controller") {
        if (card.controller === context.controller) {
          return false;
        }
      }

      if (restriction === "not-owner") {
        if (card.owner === context.controller) {
          return false;
        }
      }

      if (restriction === "different-targets") {
        if (context.previousTargets.some((target) => target.id === card.id)) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Get all legal targets for a target definition
 * @template TCustomState - The custom state type for CardInstance
 * @template TGameState - The game state type
 * @param targetDef - Target definition
 * @param state - Game state
 * @param registry - Card definition registry
 * @param context - Target context
 * @returns Array of legal target cards
 */
export function getLegalTargets<
  TCustomState = unknown,
  TGameState extends { cards: Record<string, CardInstance<TCustomState>> } = {
    cards: Record<string, CardInstance<TCustomState>>;
  },
>(
  targetDef: TargetDefinition,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
  context: TargetContext<TCustomState>,
): CardInstance<TCustomState>[] {
  const allCards = Object.values(state.cards);
  return allCards.filter((card) =>
    isLegalTarget(card, targetDef, state, registry, context),
  );
}

/**
 * Validate a target selection against a target definition
 * @template TCustomState - The custom state type for CardInstance
 * @template TGameState - The game state type
 * @param targets - Selected target cards
 * @param targetDef - Target definition
 * @param state - Game state
 * @param registry - Card definition registry
 * @param context - Target context (without previousTargets)
 * @returns Validation result
 */
export function validateTargetSelection<
  TCustomState = unknown,
  TGameState extends { cards: Record<string, CardInstance<TCustomState>> } = {
    cards: Record<string, CardInstance<TCustomState>>;
  },
>(
  targets: CardInstance<TCustomState>[],
  targetDef: TargetDefinition,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
  context: Omit<TargetContext<TCustomState>, "previousTargets">,
): ValidationResult {
  // Validate count
  if (typeof targetDef.count === "number") {
    // Exact count required
    if (targets.length !== targetDef.count) {
      return {
        valid: false,
        error: `Expected ${targetDef.count} target(s), but got ${targets.length}`,
      };
    }
  } else {
    // Range count
    const { min, max } = targetDef.count;
    if (targets.length < min) {
      return {
        valid: false,
        error: `Expected at least ${min} target(s), but got ${targets.length}`,
      };
    }
    if (targets.length > max) {
      return {
        valid: false,
        error: `Expected at most ${max} target(s), but got ${targets.length}`,
      };
    }
  }

  // Validate each target individually
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    if (!target) {
      return {
        valid: false,
        error: `Target at index ${i} is undefined`,
      };
    }

    const previousTargets = targets.slice(0, i);

    const fullContext: TargetContext<TCustomState> = {
      ...context,
      previousTargets,
    };

    if (!isLegalTarget(target, targetDef, state, registry, fullContext)) {
      return {
        valid: false,
        error: `Target at index ${i} (${String(target.id)}) is not a legal target`,
      };
    }
  }

  return { valid: true };
}

/**
 * Enumerate all valid target combinations for a target definition
 * Useful for AI move generation
 * @template TCustomState - The custom state type for CardInstance
 * @template TGameState - The game state type
 * @param targetDef - Target definition
 * @param state - Game state
 * @param registry - Card definition registry
 * @param context - Target context
 * @param maxCombinations - Maximum number of combinations to return
 * @returns Array of target combinations (each combination is an array of cards)
 */
export function enumerateTargetCombinations<
  TCustomState = unknown,
  TGameState extends { cards: Record<string, CardInstance<TCustomState>> } = {
    cards: Record<string, CardInstance<TCustomState>>;
  },
>(
  targetDef: TargetDefinition,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
  context: TargetContext<TCustomState>,
  maxCombinations: number,
): CardInstance<TCustomState>[][] {
  const legalTargets = getLegalTargets(targetDef, state, registry, context);

  // Determine count range
  let minCount: number;
  let maxCount: number;

  if (typeof targetDef.count === "number") {
    minCount = targetDef.count;
    maxCount = targetDef.count;
  } else {
    minCount = targetDef.count.min;
    maxCount = Math.min(targetDef.count.max, legalTargets.length);
  }

  const combinations: CardInstance<TCustomState>[][] = [];

  // Helper function to generate combinations recursively
  function generateCombinations(
    start: number,
    current: CardInstance<TCustomState>[],
    targetCount: number,
  ): void {
    if (combinations.length >= maxCombinations) {
      return;
    }

    if (current.length === targetCount) {
      combinations.push([...current]);
      return;
    }

    for (let i = start; i < legalTargets.length; i++) {
      const candidate = legalTargets[i];
      if (!candidate) {
        continue;
      }

      // Check if this candidate is legal given previous selections
      const updatedContext: TargetContext<TCustomState> = {
        ...context,
        previousTargets: current,
      };

      if (
        isLegalTarget(candidate, targetDef, state, registry, updatedContext)
      ) {
        current.push(candidate);
        generateCombinations(i + 1, current, targetCount);
        current.pop();
      }

      if (combinations.length >= maxCombinations) {
        break;
      }
    }
  }

  // Generate combinations for each valid count
  for (let count = minCount; count <= maxCount; count++) {
    generateCombinations(0, [], count);
    if (combinations.length >= maxCombinations) {
      break;
    }
  }

  return combinations.slice(0, maxCombinations);
}
