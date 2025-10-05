/**
 * TargetValidator - High-Level Validation API
 *
 * Provides validation APIs for checking target selections before execution.
 * Combines filter resolution with security validation to give clear feedback.
 */

import type { CoreCardInstance } from "../card/core-card-instance";
import type { CoreCardInstanceStore } from "../card/core-card-instance-store";
import type {
  BaseCoreCardFilter,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
} from "../types/game-specific-types";
import type { SecurityRuleRegistry } from "./security-rule-registry";
import { type TargetContext, TargetResolver } from "./target-resolver";
import type { ValidationResult } from "./types";

/**
 * High-level validator for target selections
 * Provides user-friendly validation APIs
 */
export class TargetValidator<
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<any> = CoreCardInstance<GameSpecificCardDefinition>,
> {
  private readonly resolver: TargetResolver<CardFilter, CardInstance>;

  constructor(
    state: any,
    cardStore: CoreCardInstanceStore<any>,
    securityRegistry?: SecurityRuleRegistry<CardInstance>,
  ) {
    this.resolver = new TargetResolver<CardFilter, CardInstance>(
      state,
      cardStore,
      securityRegistry,
    );
  }

  /**
   * Get the underlying TargetResolver (for advanced use cases)
   */
  getResolver(): TargetResolver<CardFilter, CardInstance> {
    return this.resolver;
  }

  /**
   * Get all valid targets for a filter
   * Returns cards that match the filter AND pass security checks
   */
  getValidTargets(
    filter: CardFilter,
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): CardInstance[] {
    return this.resolver.resolveCardTargets(filter, sourceCard, context);
  }

  /**
   * Check if a specific card is a valid target for a filter
   * Returns true if the card matches the filter AND passes security checks
   */
  isValidTarget(
    filter: CardFilter,
    target: CardInstance,
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): boolean {
    const validTargets = this.getValidTargets(filter, sourceCard, context);
    return validTargets.some(
      (validTarget) => validTarget.instanceId === target.instanceId,
    );
  }

  /**
   * Validate a target selection (user has chosen specific targets)
   * Returns ValidationResult with reason if invalid
   */
  validateTargetSelection(
    filter: CardFilter,
    selectedTargets: CardInstance[],
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): ValidationResult {
    // 1. Check target count
    const countValidation = this.validateTargetCount(filter, selectedTargets);
    if (!countValidation.valid) {
      return countValidation;
    }

    // 2. Get all valid targets
    const validTargets = this.getValidTargets(filter, sourceCard, context);

    // 3. Check each selected target is in valid set
    for (const selected of selectedTargets) {
      const isValid = validTargets.some(
        (valid) => valid.instanceId === selected.instanceId,
      );

      if (!isValid) {
        // Check if it failed security check specifically
        const securityValidation = this.checkTargetSecurity(
          selected,
          sourceCard,
          context,
        );

        if (!securityValidation.valid) {
          // Security violation
          return securityValidation;
        }

        // Didn't match filter
        return {
          valid: false,
          reason: "TARGET_NOT_IN_VALID_SET",
          message: `Target ${selected.instanceId} does not match the filter criteria`,
          details: {
            targetId: selected.instanceId,
            targetName: (selected.card as any).name,
          },
        };
      }
    }

    // All checks passed
    return { valid: true };
  }

  /**
   * Validate the number of targets selected
   */
  private validateTargetCount(
    filter: CardFilter,
    selectedTargets: CardInstance[],
  ): ValidationResult {
    const count = filter.count;

    // No count restriction
    if (count === undefined) {
      return { valid: true };
    }

    // "all" allows any number
    if (count === "all") {
      return { valid: true };
    }

    // Numeric count
    const expectedCount = count as number;

    // "upTo" modifier allows 0 to N
    if (filter.upTo) {
      if (selectedTargets.length > expectedCount) {
        return {
          valid: false,
          reason: "INCORRECT_TARGET_COUNT",
          message: `Expected up to ${expectedCount} target(s), got ${selectedTargets.length}`,
          details: {
            expected: expectedCount,
            actual: selectedTargets.length,
            upTo: true,
          },
        };
      }
      return { valid: true };
    }

    // Exact count required
    if (selectedTargets.length !== expectedCount) {
      return {
        valid: false,
        reason: "INCORRECT_TARGET_COUNT",
        message: `Expected ${expectedCount} target(s), got ${selectedTargets.length}`,
        details: {
          expected: expectedCount,
          actual: selectedTargets.length,
        },
      };
    }

    return { valid: true };
  }

  /**
   * Check a single target against security rules
   * (without applying filter criteria)
   */
  private checkTargetSecurity(
    target: CardInstance,
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): ValidationResult {
    const securityRegistry = this.resolver.getSecurityRegistry();
    return securityRegistry.validateTarget(target, sourceCard, context);
  }
}
