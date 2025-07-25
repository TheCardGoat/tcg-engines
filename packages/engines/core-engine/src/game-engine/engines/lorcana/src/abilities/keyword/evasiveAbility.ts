import type { LorcanaKeywordAbility } from "./keyword";

export interface EvasiveAbility extends LorcanaKeywordAbility {
  keyword: "evasive";
  type: "keyword";
}

// 10.4. Evasive
// 10.4.1. The Evasive keyword represents a static ability that creates a challenging restriction. Evasive means "This character can't be challenged except by a character with Evasive."
// 10.4.2. The standard reminder text for Evasive is "(Only characters with Evasive can challenge this character.)"
export const evasiveAbility: EvasiveAbility = {
  keyword: "evasive",
  type: "keyword",
  text: "_(Only characters with Evasive can challenge this character.)_",
};

export const isEvasiveAbility = (
  ability?: LorcanaKeywordAbility,
): ability is EvasiveAbility =>
  ability?.type === "keyword" && ability?.keyword === "evasive";
