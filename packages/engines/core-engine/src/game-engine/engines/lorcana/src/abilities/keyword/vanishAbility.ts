import type { LorcanaKeywordAbility } from "./keyword";

export interface VanishAbility extends LorcanaKeywordAbility {
  keyword: "vanish";
  type: "keyword";
}

export const vanishAbility: VanishAbility = {
  type: "keyword",
  keyword: "vanish",
  text: "_(When an opponent chooses this character for an action, banish them.)_",
};

export const isVanishAbility = (
  ability?: LorcanaKeywordAbility,
): ability is VanishAbility =>
  ability?.type === "keyword" && ability?.keyword === "vanish";
