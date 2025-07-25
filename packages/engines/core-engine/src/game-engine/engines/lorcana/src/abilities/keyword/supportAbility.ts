import type { LorcanaKeywordAbility } from "./keyword";

export interface SupportAbility extends LorcanaKeywordAbility {
  keyword: "support";
  type: "keyword";
}

// 10.11.Support
// 10.11.1. The Support keyword represents a triggered ability. Support means "Whenever this character quests, you may add this character's {S} to another chosen character's {S} this turn."
// 10.11.2. The standard reminder text for Support is "(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)"
export const supportAbility: SupportAbility = {
  keyword: "support",
  type: "keyword",
  text: "_(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
};

export const isSupportAbility = (
  ability?: LorcanaKeywordAbility,
): ability is SupportAbility =>
  ability?.type === "keyword" && ability?.keyword === "support";
