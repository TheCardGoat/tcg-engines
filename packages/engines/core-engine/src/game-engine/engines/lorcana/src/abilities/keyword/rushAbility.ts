import type { LorcanaKeywordAbility } from "./keyword";

export interface RushAbility extends LorcanaKeywordAbility {
  keyword: "rush";
  type: "keyword";
}

// 10.7. Rush
// 10.7.1. The Rush keyword represents a static ability. Rush means "This character can challenge as though they were in play at the beginning of your turn."
// 10.7.2. The standard reminder text for Rush is "(This character can challenge the turn they're played.)"
export const rushAbility: RushAbility = {
  keyword: "rush",
  type: "keyword",
  text: "_(This character can challenge the turn they're played.)_",
};

export const isRushAbility = (
  ability?: LorcanaKeywordAbility,
): ability is RushAbility =>
  ability?.type === "keyword" && ability?.keyword === "rush";
