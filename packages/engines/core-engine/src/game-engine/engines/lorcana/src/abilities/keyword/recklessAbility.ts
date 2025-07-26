import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface RecklessAbility extends LorcanaBaseKeywordAbility {
  keyword: "reckless";
  type: "keyword";
}

// 10.5. Reckless
// 10.5.1. The Reckless keyword represents two static abilities.
// 10.5.2. The first ability means "This character can't quest."
// 10.5.3. The second ability means "You can't declare the end of your turn if this character is ready and can challenge an opposing exerted character or location."
// 10.5.4. The standard reminder text for Reckless is "(This character can't quest and must challenge each turn if able.)"
// 10.5.5. A player can still exert a character with Reckless to use its abilities or sing songs.
export const recklessAbility: RecklessAbility = {
  keyword: "reckless",
  type: "keyword",
  text: "**Reckless** _(This character can't quest and must challenge if able.)_",
  effects: [], // Keyword abilities have empty effects by default
};

export const isRecklessAbility = (
  ability?: LorcanaKeywordAbility,
): ability is RecklessAbility =>
  ability?.type === "keyword" && ability?.keyword === "reckless";
