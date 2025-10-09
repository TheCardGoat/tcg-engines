import type { ResourcePool } from "../resources/resource-management";
import {
  canPayCost as canPayResourceCost,
  payResourceCost,
} from "../resources/resource-management";
import type { Result } from "../shared/result";

/**
 * Represents a cost that must be paid to perform an action
 *
 * Rule 2-9-1: Cost paid by resting necessary number of active Resources
 * Rule 9-1-7-3: Some effects specify additional costs (①, ②, etc.)
 */
export type Cost = {
  /** Number of resources to rest (Rule 2-9-1) */
  resourceCost: number;
  /** Additional costs like discarding cards, removing counters, etc. */
  additionalCosts: readonly AdditionalCost[];
};

/**
 * Additional costs beyond resource payment
 * Examples: Discard cards, remove counters, specific requirements
 */
export type AdditionalCost = {
  type: "discard" | "removeCounter" | "custom";
  description: string;
  /** Optional validation function for complex requirements */
  validate?: (context: PaymentContext) => boolean;
};

/**
 * Context provided when paying costs
 * Contains all information needed to validate and execute payment
 */
export type PaymentContext = {
  resourcePool: ResourcePool;
  /** Hand cards available for discard costs */
  hand?: readonly string[];
  /** Counters available for removal costs */
  counters?: Record<string, number>;
  /** Additional context for custom costs */
  [key: string]: unknown;
};

/**
 * Result of cost payment operation
 */
export type PaymentResult = {
  updatedResourcePool: ResourcePool;
  /** IDs of cards discarded as part of payment */
  discardedCards?: readonly string[];
  /** Counters removed as part of payment */
  removedCounters?: Record<string, number>;
};

/**
 * Cost operation error types
 */
export type CostError =
  | {
      type: "insufficientResources";
      required: number;
      available: number;
    }
  | {
      type: "invalidCost";
      cost: number;
    }
  | {
      type: "additionalCostNotMet";
      costDescription: string;
    };

/**
 * Options for cost calculation
 */
export type CostCalculationOptions = {
  /** Total cost reduction to apply (cannot reduce below 0) */
  costReduction?: number;
};

/**
 * Calculate deployment cost for a card
 * Applies cost reduction effects if provided
 *
 * Rule 2-9-2: All cards except Resources and tokens have a cost
 * Rule 2-9-3: Tokens have cost zero
 *
 * @param card - Card to calculate cost for
 * @param options - Cost calculation options (reductions, etc.)
 * @returns Cost object with resource cost and additional costs
 */
export const calculateDeploymentCost = (
  card: { cost?: number },
  options: CostCalculationOptions = {},
): Cost => {
  const baseCost = card.cost ?? 0;
  const costReduction = options.costReduction ?? 0;

  // Apply cost reduction, cannot go below zero
  const resourceCost = Math.max(0, baseCost - costReduction);

  return {
    resourceCost,
    additionalCosts: [],
  };
};

/**
 * Calculate ability activation cost
 * Parses cost symbols like ① (cost 1), ② (cost 2), etc.
 *
 * Rule 9-1-7-3: Symbol "①" means paying cost equal to number in symbol
 *
 * @param costSymbol - Cost symbol (e.g., "①", "②")
 * @param options - Cost calculation options
 * @returns Cost object
 */
export const calculateAbilityCost = (
  costSymbol: string,
  options: CostCalculationOptions = {},
): Cost => {
  // Map circled numbers to costs: ① = 1, ② = 2, etc.
  const costMap: Record<string, number> = {
    "①": 1,
    "②": 2,
    "③": 3,
    "④": 4,
    "⑤": 5,
    "⑥": 6,
    "⑦": 7,
    "⑧": 8,
    "⑨": 9,
    "⑩": 10,
  };

  const baseCost = costMap[costSymbol] ?? 0;
  const costReduction = options.costReduction ?? 0;

  // Apply cost reduction, cannot go below zero
  const resourceCost = Math.max(0, baseCost - costReduction);

  return {
    resourceCost,
    additionalCosts: [],
  };
};

/**
 * Check if player can pay the specified cost
 *
 * @param cost - Cost to validate
 * @param resourcePool - Player's resource pool
 * @returns True if player can pay cost
 */
export const canPayCost = (cost: Cost, resourcePool: ResourcePool): boolean => {
  // Check resource cost
  if (!canPayResourceCost(resourcePool, cost.resourceCost)) {
    return false;
  }

  // Additional costs validation would go here
  // For now, we only validate resource costs

  return true;
};

/**
 * Pay the specified cost, updating resource pool and other game state
 *
 * @param cost - Cost to pay
 * @param context - Payment context with resource pool and other state
 * @returns Result with updated state or error
 */
export const payCost = (
  cost: Cost,
  context: PaymentContext,
): Result<PaymentResult, CostError> => {
  // Validate cost is non-negative
  if (cost.resourceCost < 0) {
    return {
      success: false,
      error: {
        type: "invalidCost",
        cost: cost.resourceCost,
      },
    };
  }

  // Pay resource cost
  const resourcePaymentResult = payResourceCost(
    context.resourcePool,
    cost.resourceCost,
  );

  // Check for resource payment failure
  if (resourcePaymentResult.success === false) {
    // Map resource error to cost error
    const resourceError = resourcePaymentResult.error;
    if (resourceError.type === "insufficientResources") {
      return {
        success: false,
        error: {
          type: "insufficientResources",
          required: resourceError.required,
          available: resourceError.available,
        },
      };
    }
    // Invalid cost from resource system
    return {
      success: false,
      error: {
        type: "invalidCost",
        cost: cost.resourceCost,
      },
    };
  }

  // Additional costs payment would go here
  // For now, we only handle resource costs

  return {
    success: true,
    data: {
      updatedResourcePool: resourcePaymentResult.data,
    },
  };
};
