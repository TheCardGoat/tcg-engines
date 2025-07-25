export * from "./bodyguardAbility";
export * from "./challengerAbility";
export * from "./evasiveAbility";
export * from "./recklessAbility";
export * from "./resistAbility";
export * from "./rushAbility";
export * from "./shiftAbility";
export * from "./singerAbility";
export * from "./singTogetherAbility";
export * from "./supportAbility";
export * from "./vanishAbility";
export * from "./voicelessAbility";
export * from "./wardAbility";

export type LorcanaKeywords =
  | "singer"
  | "shift"
  | "challenger"
  | "sing-together"
  | "bodyguard"
  | "rush"
  | "reckless"
  | "evasive"
  | "resist"
  | "support"
  | "voiceless"
  | "ward"
  | "vanish";

export interface LorcanaKeywordAbility {
  type: "keyword";
  keyword: LorcanaKeywords;
  text?: string;
  name?: string;
}
