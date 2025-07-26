import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface SupportAbility extends LorcanaBaseKeywordAbility {
  keyword: "support";
  type: "keyword";
}

export const supportAbility: SupportAbility = {
  keyword: "support",
  type: "keyword",
  text: "**Support** _(Whenever this character quests, you may add their ◆ to another chosen character's ◆ this turn.)_",
  effects: [], // Keyword abilities have empty effects by default
};

export const isSupportAbility = (
  ability?: LorcanaKeywordAbility,
): ability is SupportAbility =>
  ability?.type === "keyword" && ability?.keyword === "support";
