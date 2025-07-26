import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface VanishAbility extends LorcanaBaseKeywordAbility {
  keyword: "vanish";
}

export const vanishAbility: VanishAbility = {
  type: "keyword",
  keyword: "vanish",
  text: "**Vanish** _(This character can't be challenged while an opposing character is ink well.)_",
  effects: [], // Keyword abilities have empty effects by default
};

export const isVanishAbility = (
  ability?: LorcanaKeywordAbility,
): ability is VanishAbility =>
  ability?.type === "keyword" && ability?.keyword === "vanish";
