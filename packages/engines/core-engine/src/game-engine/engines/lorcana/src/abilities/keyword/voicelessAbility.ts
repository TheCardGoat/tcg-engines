import type { LorcanaKeywordAbility } from "./keyword";

export interface VoicelessAbility extends LorcanaKeywordAbility {
  keyword: "voiceless";
  type: "keyword";
}

export const voicelessAbility: VoicelessAbility = {
  keyword: "voiceless",
  type: "keyword",
  text: "This character can't {E} to sing songs.",
};

export const isVoicelessAbility = (
  ability?: LorcanaKeywordAbility,
): ability is VoicelessAbility =>
  ability?.type === "keyword" && ability?.keyword === "voiceless";
