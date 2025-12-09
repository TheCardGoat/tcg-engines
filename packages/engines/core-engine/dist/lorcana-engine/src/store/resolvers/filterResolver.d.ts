import type { DynamicAmount, ResolvingParam } from "@lorcanito/lorcana-engine";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
export declare function isSelfReferencingFilter(filter: TargetFilter): boolean;
export declare function createTargetFiltersPredicate(store: MobXRootStore, player?: string, activeFilters?: TargetFilter[], source?: CardModel, excludeSelf?: boolean, params?: ResolvingParam): (card: CardModel) => boolean;
export declare function filterByOwner(value: "self" | "opponent" | string, playerId: string, card: CardModel): boolean;
export type StringComparison = {
    operator: "eq";
    value: string | string[];
};
export type NumericOperator = "gt" | "lt" | "eq" | "gte" | "lte";
export type NumericComparison = {
    operator: NumericOperator;
    value: number | DynamicAmount;
};
export declare function isStringComparison(comparison: NumericComparison | StringComparison): comparison is StringComparison;
export declare function isNumericComparison(comparison: NumericComparison | StringComparison): comparison is NumericComparison;
export declare function filterByAttribute(value: "cost" | "name" | "title" | "strength" | "instanceId", comparison: NumericComparison | StringComparison, store: MobXRootStore, card?: CardModel, ignoreBonuses?: boolean): boolean;
export declare function computeNumericOperator(numericComparison: NumericComparison, numericValueToCompare: number | DynamicAmount, rootStore: MobXRootStore, source?: CardModel, targets?: CardModel[]): boolean;
//# sourceMappingURL=filterResolver.d.ts.map