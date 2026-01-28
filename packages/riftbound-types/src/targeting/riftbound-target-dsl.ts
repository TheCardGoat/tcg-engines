/**
 * Riftbound Target DSL Type Definitions
 *
 * Domain-specific language for targeting cards and players.
 */

/**
 * Target controller - who controls the target
 */
export type TargetController = "self" | "opponent" | "any";

/**
 * Target zone - where the target is located
 */
export type TargetZone =
  | "hand"
  | "deck"
  | "discard"
  | "field"
  | "exile"
  | "any";

/**
 * Base target query interface
 */
export interface BaseTargetQuery {
  readonly type: string;
}

/**
 * Card target query - targets cards
 */
export interface CardTargetQuery extends BaseTargetQuery {
  readonly type: "card";
  readonly controller?: TargetController;
  readonly zone?: TargetZone;
  readonly cardType?: string;
  readonly filters?: TargetFilter[];
}

/**
 * Player target query - targets players
 */
export interface PlayerTargetQuery extends BaseTargetQuery {
  readonly type: "player";
  readonly which: "self" | "opponent" | "any" | "all";
}

/**
 * Self target query - targets the source card
 */
export interface SelfTargetQuery extends BaseTargetQuery {
  readonly type: "self";
}

/**
 * Union type for all target queries
 */
export type TargetQuery = CardTargetQuery | PlayerTargetQuery | SelfTargetQuery;

/**
 * Target filter - additional constraints on targets
 */
export interface TargetFilter {
  readonly property: string;
  readonly operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
  readonly value: unknown;
}

/**
 * Target selection mode
 */
export type TargetSelectionMode =
  | "single" // Select exactly one
  | "multiple" // Select multiple (up to max)
  | "all" // Select all matching
  | "optional"; // Select zero or one

/**
 * Complete target specification
 */
export interface TargetSpec {
  readonly query: TargetQuery;
  readonly mode: TargetSelectionMode;
  readonly min?: number;
  readonly max?: number;
}

/**
 * Type guard for card target queries
 */
export function isCardTargetQuery(
  query: TargetQuery,
): query is CardTargetQuery {
  return query.type === "card";
}

/**
 * Type guard for player target queries
 */
export function isPlayerTargetQuery(
  query: TargetQuery,
): query is PlayerTargetQuery {
  return query.type === "player";
}

/**
 * Type guard for self target queries
 */
export function isSelfTargetQuery(
  query: TargetQuery,
): query is SelfTargetQuery {
  return query.type === "self";
}
