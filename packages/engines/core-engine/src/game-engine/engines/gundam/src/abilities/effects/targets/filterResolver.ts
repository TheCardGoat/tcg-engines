import { exhaustiveCheck } from "~/game-engine/core-engine/utils/exhaustiveCheck";
import {
  type GundamitoCard,
  isGundamitoBaseCard,
  isGundamitoUnitCard,
} from "../../../cards/definitions/cardTypes";

export type NumericOperator = "gt" | "lt" | "eq" | "gte" | "lte";

export type NumericComparison = {
  operator: NumericOperator;
  value: number;
};

export type StringComparison = {
  operator: "eq";
  value: string | string[];
};

export function isStringComparison(
  comparison: NumericComparison | StringComparison,
): comparison is StringComparison {
  return (
    typeof comparison.value === "string" ||
    (Array.isArray(comparison.value) && typeof comparison.value[0] === "string")
  );
}

export function isNumericComparison(
  comparison: NumericComparison | StringComparison,
): comparison is NumericComparison {
  return typeof comparison.value === "number";
}

export function computeNumericOperator(
  numericComparison: NumericComparison,
  numericValueToCompare: number,
): boolean {
  const operator = numericComparison.operator;

  const valueToCompare: number = numericValueToCompare;

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

export function filterByAttribute(
  value: "cost" | "level" | "ap" | "hp" | "name" | "title",
  comparison: NumericComparison | StringComparison,
  card?: GundamitoCard,
): boolean {
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

    return (
      comparison.value.toLocaleLowerCase() === attribute.toLocaleLowerCase()
    );
  }

  if (isNumericComparison(comparison) && typeof attribute === "number") {
    return computeNumericOperator(comparison, attribute);
  }

  return false;
}
