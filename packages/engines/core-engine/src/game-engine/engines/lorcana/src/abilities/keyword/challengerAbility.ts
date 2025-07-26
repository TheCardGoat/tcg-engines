import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface ChallengerAbility extends LorcanaBaseKeywordAbility {
  keyword: "challenger";
  value: number;
}

export const challengerAbility = (value: number): ChallengerAbility => {
  return {
    type: "keyword",
    keyword: "challenger",
    value: value,
    text: `**Challenger** +${value} (_When challenging, this character get +${value}3 {S}._)`,
    effects: [], // Keyword abilities have empty effects by default
  };
};

export const isChallengerAbility = (
  ability?: LorcanaKeywordAbility,
): ability is ChallengerAbility =>
  ability?.type === "keyword" && ability?.keyword === "challenger";
