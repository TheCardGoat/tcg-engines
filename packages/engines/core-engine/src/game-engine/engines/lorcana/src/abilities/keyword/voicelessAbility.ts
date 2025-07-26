import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface VoicelessAbility extends LorcanaBaseKeywordAbility {
  keyword: "voiceless";
}

export const voicelessAbility: VoicelessAbility = {
  keyword: "voiceless",
  type: "keyword",
  text: "**Voiceless** _(This character can't sing songs.)_",
  effects: [], // Keyword abilities have empty effects by default
};

export const isVoicelessAbility = (
  ability?: LorcanaKeywordAbility,
): ability is VoicelessAbility =>
  ability?.type === "keyword" && ability?.keyword === "voiceless";
