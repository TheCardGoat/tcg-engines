import { exhaustiveCheck } from "~/game-engine/core-engine/utils/exhaustiveCheck";
import { isGundamitoBaseCard, isGundamitoUnitCard, } from "../../../cards/definitions/cardTypes";
export function isStringComparison(comparison) {
    return (typeof comparison.value === "string" ||
        (Array.isArray(comparison.value) && typeof comparison.value[0] === "string"));
}
export function isNumericComparison(comparison) {
    return typeof comparison.value === "number";
}
export function computeNumericOperator(numericComparison, numericValueToCompare) {
    const operator = numericComparison.operator;
    const valueToCompare = numericValueToCompare;
    const comparisonValue = numericComparison.value;
    switch (operator) {
        case "eq": {
            return valueToCompare === comparisonValue;
        }
        case "gt": {
            return valueToCompare > comparisonValue;
        }
        case "gte": {
            return valueToCompare >= comparisonValue;
        }
        case "lt": {
            return valueToCompare < comparisonValue;
        }
        case "lte": {
            return valueToCompare <= comparisonValue;
        }
        default: {
            exhaustiveCheck(operator);
            return false;
        }
    }
}
export function filterByAttribute(value, comparison, card) {
    if (!card) {
        return false;
    }
    if (!(isGundamitoBaseCard(card) || isGundamitoUnitCard(card))) {
        return false;
    }
    const attribute = card[value];
    if (isStringComparison(comparison) && typeof attribute === "string") {
        if (Array.isArray(comparison.value)) {
            return comparison.value.some((name) => {
                return name.toLocaleLowerCase() === attribute.toLocaleLowerCase();
            });
        }
        return (comparison.value.toLocaleLowerCase() === attribute.toLocaleLowerCase());
    }
    if (isNumericComparison(comparison) && typeof attribute === "number") {
        return computeNumericOperator(comparison, attribute);
    }
    return false;
}
//# sourceMappingURL=filterResolver.js.map