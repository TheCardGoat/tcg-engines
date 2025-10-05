/**
 * Targeting System Types
 *
 * Shared types for the targeting and security validation system.
 */

/**
 * Result of a validation check
 * Used for both security rules and target validation
 */
export type ValidationResult = {
  readonly valid: boolean;
  readonly reason?: string;
  readonly message?: string;
  readonly details?: Readonly<Record<string, any>>;
};

/**
 * Context passed to security rules for evaluation
 */
export type SecurityContext = {
  readonly currentPlayer?: string;
  readonly [key: string]: any;
};
