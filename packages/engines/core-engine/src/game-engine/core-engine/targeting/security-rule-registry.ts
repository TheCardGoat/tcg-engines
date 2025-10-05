/**
 * SecurityRuleRegistry - Manages game-specific targeting security rules
 *
 * Provides centralized management of security rules that prevent invalid targeting
 * (Ward, protection abilities, hexproof, etc.)
 */

import type { SecurityContext, ValidationResult } from "./types";

/**
 * A security rule that can block targeting
 * Rules are evaluated for each potential target
 */
export type SecurityRule<CardInstance> = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly check: (
    target: CardInstance,
    source: CardInstance | undefined,
    context: SecurityContext | undefined,
  ) => ValidationResult;
};

/**
 * Registry for managing security rules
 * Provides centralized, auditable security validation
 */
export class SecurityRuleRegistry<CardInstance> {
  private rules: Map<string, SecurityRule<CardInstance>> = new Map();

  /**
   * Register a new security rule
   * Throws if a rule with the same ID already exists
   */
  registerRule(rule: SecurityRule<CardInstance>): void {
    if (this.rules.has(rule.id)) {
      throw new Error(
        `Security rule with ID "${rule.id}" is already registered`,
      );
    }
    this.rules.set(rule.id, rule);
  }

  /**
   * Unregister a security rule by ID
   */
  unregisterRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get a specific rule by ID
   */
  getRule(ruleId: string): SecurityRule<CardInstance> | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Get all registered rules
   * Returns immutable array
   */
  getAllRules(): readonly SecurityRule<CardInstance>[] {
    return Array.from(this.rules.values());
  }

  /**
   * Check if a target is valid against all registered rules
   * Returns the first validation failure, or success if all pass
   */
  validateTarget(
    target: CardInstance,
    source: CardInstance | undefined,
    context: SecurityContext | undefined,
  ): ValidationResult {
    for (const rule of this.rules.values()) {
      const result = rule.check(target, source, context);
      if (!result.valid) {
        // First failure stops evaluation (fail-fast)
        return result;
      }
    }

    // All rules passed
    return { valid: true };
  }

  /**
   * Clear all registered rules
   */
  clear(): void {
    this.rules.clear();
  }

  /**
   * Get the number of registered rules
   */
  get size(): number {
    return this.rules.size;
  }
}

/**
 * Built-in security rules that can be registered
 */
export const BuiltInSecurityRules = {
  /**
   * Ward protection - prevents opponent from targeting
   * Cards with "ward" keyword cannot be targeted by opponent's abilities
   */
  createWardRule<CardInstance>(): SecurityRule<CardInstance> {
    return {
      id: "ward-protection",
      name: "Ward Protection",
      description: "Cards with Ward cannot be targeted by opponent abilities",
      check: (target, source, _context) => {
        // Ward only applies when there's a source (targeted effect)
        if (!source) {
          return { valid: true };
        }

        // Get target's keywords
        const targetKeywords = ((target as any).card?.keywords ||
          []) as string[];
        const hasWard = targetKeywords.includes("ward");

        if (!hasWard) {
          return { valid: true };
        }

        // Ward protects from opponent targeting
        const targetOwner = (target as any).owner;
        const sourceOwner = (source as any).owner;

        if (targetOwner === sourceOwner) {
          // Same owner - can target
          return { valid: true };
        }

        // Different owners - Ward blocks targeting
        return {
          valid: false,
          reason: "WARD_PROTECTION",
          message: "This card has Ward and cannot be targeted by opponent",
          details: {
            targetId: (target as any).instanceId,
            targetName: (target as any).card?.name,
          },
        };
      },
    };
  },
};
