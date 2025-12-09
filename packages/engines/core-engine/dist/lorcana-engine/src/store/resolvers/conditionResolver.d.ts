import { type CardModel, type MobXRootStore, type NumericComparison, type TargetFilter } from "@lorcanito/lorcana-engine";
import { type NumericOperator } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
export type ThisTurnCondition = {
    type: "this-turn";
    value: "has-challenged" | "was-damaged" | "inked";
    target: "self" | "opponent";
    negate?: boolean;
} & ({
    filters?: never;
    comparison?: never;
} | {
    filters: TargetFilter[];
    comparison: NumericComparison;
});
export type FilterCondition = {
    type: "filter";
    filters: TargetFilter[];
    comparison: NumericComparison;
    negate?: boolean;
    excludeSelf?: boolean;
};
export type Condition = {
    type: "char-is-at-location";
    negate?: boolean;
} | {
    type: "first-time-move-to-location";
} | {
    type: "no-character-has-quested";
} | {
    type: "no-other-character-has-quested";
} | {
    type: "exerted";
} | {
    type: "not-alone";
} | {
    type: "played-songs";
    value?: boolean;
} | {
    type: "played-actions";
    comparison: NumericComparison;
} | {
    type: "have-strongest-character";
} | {
    type: "resolution";
    value: "bodyguard" | "shift";
} | {
    type: "attribute";
    attribute: "strength";
    comparison: NumericComparison;
} | {
    type: "damage";
    comparison: NumericComparison;
} | FilterCondition | ThisTurnCondition | {
    type: "chars-at-location";
    filters?: TargetFilter[];
    comparison: NumericComparison;
} | {
    type: "clash";
    filters: TargetFilter[];
    operator: NumericOperator;
} | {
    type: "play";
    comparison: NumericComparison;
} | {
    type: "hand";
    amount: number | NumericOperator;
    player: "self" | "opponent";
    negate?: boolean;
} | {
    type: "player";
    player: "self" | "opponent";
    attribute: "lore";
    comparison: NumericComparison;
} | {
    type: "player-lore-comparison";
    comparison: NumericComparison;
} | {
    type: "during-turn";
    value: "self" | "opponent";
} | {
    type: "inkwell";
    amount: number;
};
export type WhileCondition = Condition;
export declare function isSelfReferencingCondition(condition: Condition): boolean;
export declare function isConditionMet(rootStore: MobXRootStore, sourceCard: CardModel, conditions?: Condition[]): boolean;
//# sourceMappingURL=conditionResolver.d.ts.map