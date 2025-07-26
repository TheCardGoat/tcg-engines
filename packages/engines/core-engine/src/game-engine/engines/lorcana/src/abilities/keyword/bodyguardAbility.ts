import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface BodyGuardAbility extends LorcanaBaseKeywordAbility {
  keyword: "bodyguard";
  type: "keyword";
}

export const bodyguardAbility: BodyGuardAbility = {
  keyword: "bodyguard",
  type: "keyword",
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  effects: [], // Keyword abilities have empty effects by default
};

export const isBodyguardAbility = (
  ability?: LorcanaKeywordAbility,
): ability is BodyGuardAbility =>
  ability?.type === "keyword" && ability?.keyword === "bodyguard";
