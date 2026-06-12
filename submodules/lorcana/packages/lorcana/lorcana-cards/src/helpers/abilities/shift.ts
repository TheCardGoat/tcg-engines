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
