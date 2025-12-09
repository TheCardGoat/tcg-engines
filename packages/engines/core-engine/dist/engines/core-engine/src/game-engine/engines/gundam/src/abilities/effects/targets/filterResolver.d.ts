import { type GundamitoCard } from "../../../cards/definitions/cardTypes";
export type NumericOperator = "gt" | "lt" | "eq" | "gte" | "lte";
export type NumericComparison = {
    operator: NumericOperator;
    value: number;
};
export type StringComparison = {
    operator: "eq";
    value: string | string[];
};
export declare function isStringComparison(comparison: NumericComparison | StringComparison): comparison is StringComparison;
export declare function isNumericComparison(comparison: NumericComparison | StringComparison): comparison is NumericComparison;
export declare function computeNumericOperator(numericComparison: NumericComparison, numericValueToCompare: number): boolean;
export declare function filterByAttribute(value: "cost" | "level" | "ap" | "hp" | "name" | "title", comparison: NumericComparison | StringComparison, card?: GundamitoCard): boolean;
//# sourceMappingURL=filterResolver.d.ts.map