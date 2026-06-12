export type RelativeOwner = "self" | "friendly" | "opponent" | "any";
export type Comparison = "eq" | "lt" | "lte" | "gt" | "gte";

export interface EntityRef<TEntityKind extends string = string> {
  kind: TEntityKind;
  instanceId: string;
  ownerId?: string;
  zoneId?: string;
}

export interface SelectionBounds {
  min: number;
  max: number | "all";
  ordered?: boolean;
}

export interface AttributePredicate<TAttribute extends string = string> {
  attribute: TAttribute;
  comparison: Comparison | "includes" | "excludes" | "neq";
  value: unknown;
}

/**
 * Result of evaluating a target expression.
 */
export interface TargetResult {
  /** Resolved entity instance ids */
  entityIds: readonly string[];
  /** Minimum number of entities that must be selected */
  min: number;
  /** Maximum number of entities that may be selected */
  max: number | "all";
  /** Whether the selection order matters */
  ordered: boolean;
  /** Entities that are visible but illegal, with shared disabled reasons */
  disabled?: ReadonlyMap<string, string>;
}

/**
 * A node in the shared target graph.
 *
 * This is intentionally a simplified intermediate representation.
 * Games compile their richer native DSLs into these nodes, then the
 * shared evaluator resolves them against a TargetEvaluationContext.
 */
export type CoreTargetExpression =
  | { op: "kind"; kind: string }
  | { op: "owner"; owner: RelativeOwner }
  | { op: "zone"; zones: readonly string[] }
  | { op: "attribute"; predicate: AttributePredicate }
  | { op: "excludeSource"; sourceId: string }
  | { op: "and"; filters: CoreTargetExpression[] }
  | { op: "or"; filters: CoreTargetExpression[] }
  | { op: "bound"; id: string }
  | { op: "context"; key: string }
  | { op: "self"; sourceId: string }
  | { op: "highest"; attribute: string }
  | { op: "lowest"; attribute: string };

/**
 * Registry that converts a game's native target DSL into the shared
 * target graph and produces protocol-facing descriptions.
 */
export interface GameTargetRegistry<TNativeTarget, TContext> {
  compile(native: TNativeTarget): CoreTargetExpression;
  describe(native: TNativeTarget, context: TContext): string;
  entityKind(native: TNativeTarget): string;
}

/**
 * Projection result that carries both engine-facing and protocol-facing
 * representations of the same resolved target.
 */
export interface TargetProjectionResult {
  engine: TargetResult;
  protocol: {
    inputType: "entitySelection";
    candidates: readonly {
      id: string;
      kind: string;
      disabledReason?: string;
    }[];
    min: number;
    max: number | "all";
    ordered: boolean;
  };
}

export interface BaseTargetFilter<
  TEntityKind extends string,
  TZone extends string,
  TAttribute extends string,
> {
  kind: TEntityKind;
  owner?: RelativeOwner;
  zones?: readonly TZone[];
  count?: number | "all" | SelectionBounds;
  excludeSource?: boolean;
  attributes?: readonly AttributePredicate<TAttribute>[];
}

export interface TargetEvaluationContext<TEntity, TZone extends string> {
  sourcePlayerId: string;
  sourceEntityId: string;
  activePlayerId: string;
  currentTurnPlayerId?: string;
  opponentOf(playerId: string): string;
  allEntities(): readonly TEntity[];
  entityId(entity: TEntity): string;
  entityOwner(entity: TEntity): string;
  entityController(entity: TEntity): string;
  entityZone(entity: TEntity): TZone;
  readAttribute(entity: TEntity, attribute: string): unknown;
}
