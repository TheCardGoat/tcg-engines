export type CoreCondition<TPredicate extends string = string> =
  | { type: "and"; conditions: CoreCondition<TPredicate>[] }
  | { type: "or"; conditions: CoreCondition<TPredicate>[] }
  | { type: "not"; condition: CoreCondition<TPredicate> }
  | { type: "turn"; player: "self" | "friendly" | "opponent" | "any" }
  | {
      type: "entityCount";
      target: unknown;
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      value: number;
    }
  | {
      type: "attribute";
      target: unknown;
      attribute: string;
      comparison: "eq" | "lt" | "lte" | "gt" | "gte";
      value: unknown;
    }
  | { type: TPredicate; payload?: unknown };

export interface ConditionPredicateAdapter<TCondition, TContext> {
  evaluate(condition: TCondition, context: TContext): boolean;
}
