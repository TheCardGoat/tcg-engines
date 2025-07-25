import type { LorcanaKeywordAbility } from "./keyword";

export interface BodyGuardAbility extends LorcanaKeywordAbility {
  keyword: "bodyguard";
  type: "keyword";
}

export const bodyguardAbility: BodyGuardAbility = {
  keyword: "bodyguard",
  type: "keyword",
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
};

export const isBodyguardAbility = (
  ability?: LorcanaKeywordAbility,
): ability is BodyGuardAbility =>
  ability?.type === "keyword" && ability?.keyword === "bodyguard";
