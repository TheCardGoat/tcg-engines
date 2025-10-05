/**
 * Targeting System - Public API
 *
 * Exports for the secure targeting system implementation.
 */

export { CardFilterBuilder } from "./card-filter-builder";
export type { SecurityRule } from "./security-rule-registry";
export {
  BuiltInSecurityRules,
  SecurityRuleRegistry,
} from "./security-rule-registry";
export type { TargetContext } from "./target-resolver";
export { TargetResolver } from "./target-resolver";
export { TargetValidator } from "./target-validator";
export type { SecurityContext, ValidationResult } from "./types";
