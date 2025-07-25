import type { LorcanaKeywordAbility } from "./keyword";

export interface WardAbility extends LorcanaKeywordAbility {
  keyword: "ward";
  type: "keyword";
}

// 10.12.Ward
// 10.12.1. The Ward keyword represents a static ability. Ward means "Your opponents can't choose this card when resolving an effect."
// 10.12.2. The standard reminder text for Ward is "(Opponents can't choose this character except to challenge.)"
// 10.12.3. Effects that don't require the player to choose still affect this character.
export const wardAbility: WardAbility = {
  type: "keyword",
  keyword: "ward",
  text: "_(Opponents can't choose this character except to challenge.)_",
};

export const isWardAbility = (
  ability?: LorcanaKeywordAbility,
): ability is WardAbility =>
  ability?.type === "keyword" && ability?.keyword === "ward";
