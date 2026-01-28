/**
 * Riftbound Condition Type Definitions
 *
 * Types for defining conditions that must be met for abilities to trigger or resolve.
 */

/**
 * Base condition type
 */
export interface BaseCondition {
  readonly type: string;
}

/**
 * Logical AND condition - all sub-conditions must be true
 */
export interface AndCondition extends BaseCondition {
  readonly type: "and";
  readonly conditions: Condition[];
}

/**
 * Logical OR condition - at least one sub-condition must be true
 */
export interface OrCondition extends BaseCondition {
  readonly type: "or";
  readonly conditions: Condition[];
}

/**
 * Logical NOT condition - inverts the sub-condition
 */
export interface NotCondition extends BaseCondition {
  readonly type: "not";
  readonly condition: Condition;
}

/**
 * Count condition - checks if a count meets a threshold
 */
export interface CountCondition extends BaseCondition {
  readonly type: "count";
  readonly target: unknown; // Will be refined with Target types
  readonly operator: "eq" | "gt" | "gte" | "lt" | "lte";
  readonly value: number;
}

/**
 * Has property condition - checks if a target has a specific property
 */
export interface HasPropertyCondition extends BaseCondition {
  readonly type: "hasProperty";
  readonly target: unknown;
  readonly property: string;
  readonly value?: unknown;
}

/**
 * Union type for all condition types
 */
export type Condition =
  | AndCondition
  | OrCondition
  | NotCondition
  | CountCondition
  | HasPropertyCondition;

/**
 * Type guard for AND conditions
 */
export function isAndCondition(
  condition: Condition,
): condition is AndCondition {
  return condition.type === "and";
}

/**
 * Type guard for OR conditions
 */
export function isOrCondition(condition: Condition): condition is OrCondition {
  return condition.type === "or";
}

/**
 * Type guard for NOT conditions
 */
export function isNotCondition(
  condition: Condition,
): condition is NotCondition {
  return condition.type === "not";
}

/**
 * Type guard for logical conditions
 */
export function isLogicalCondition(
  condition: Condition,
): condition is AndCondition | OrCondition | NotCondition {
  return (
    condition.type === "and" ||
    condition.type === "or" ||
    condition.type === "not"
  );
}
