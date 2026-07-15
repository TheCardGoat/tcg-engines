import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export function shift(cost: number): KeywordAbilityDefinition;
export function shift(shiftTarget: string, cost: number): KeywordAbilityDefinition;
export function shift(costOrTarget: number | string, cost?: number): KeywordAbilityDefinition {
  if (typeof costOrTarget === "string") {
    return {
      keyword: "Shift",
      text: `Shift ${cost}`,
      type: "keyword",
      cost: { ink: cost! },
      shiftTarget: costOrTarget,
    };
  }
  return {
    keyword: "Shift",
    text: `Shift ${costOrTarget}`,
    type: "keyword",
    cost: { ink: costOrTarget },
  };
}

export function classificationShift(
  shiftClassification: string,
  cost: number,
): KeywordAbilityDefinition {
  return {
    keyword: "Shift",
    text: `${shiftClassification} Shift ${cost}`,
    type: "keyword",
    cost: { ink: cost },
    shiftClassification,
  };
}

export function temporaryShift(cost: number): KeywordAbilityDefinition;
export function temporaryShift(shiftTarget: string, cost: number): KeywordAbilityDefinition;
export function temporaryShift(
  shiftTarget: string,
  cost: number,
  mode: "classification",
): KeywordAbilityDefinition;
export function temporaryShift(
  costOrTarget: number | string,
  cost?: number,
  mode?: "classification",
): KeywordAbilityDefinition {
  const shiftCost = typeof costOrTarget === "string" ? cost! : costOrTarget;
  const text =
    typeof costOrTarget === "string" && mode === "classification"
      ? `${costOrTarget} Shift ${shiftCost}`
      : `Shift ${shiftCost}`;

  return {
    keyword: "Shift",
    text,
    type: "keyword",
    cost: { ink: shiftCost },
    ...(typeof costOrTarget === "string" && mode === "classification"
      ? { shiftClassification: costOrTarget }
      : {}),
    ...(typeof costOrTarget === "string" && mode !== "classification"
      ? { shiftTarget: costOrTarget }
      : {}),
    temporaryShift: true,
  };
}

export function comboShift(
  targetNames: string[],
  cost: number,
  minTargets = 1,
  maxTargets = targetNames.length,
): KeywordAbilityDefinition {
  return {
    keyword: "Shift",
    text: `Combo Shift ${cost}`,
    type: "keyword",
    cost: { ink: cost },
    multiShift: {
      targetNames,
      minTargets,
      maxTargets,
      requireDistinctNames: true,
    },
  };
}

export function duoShift(targetNames: [string, string], cost: number): KeywordAbilityDefinition {
  return {
    keyword: "Shift",
    text: `Duo Shift ${cost}`,
    type: "keyword",
    cost: { ink: cost },
    multiShift: {
      targetNames,
      minTargets: targetNames.length,
      maxTargets: targetNames.length,
      requireDistinctNames: true,
      requireEachTargetName: true,
    },
  };
}
