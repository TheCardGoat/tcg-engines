import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export const resist = (value: number): KeywordAbilityDefinition => ({
  keyword: "Resist",
  text: `Resist +${value}`,
  type: "keyword",
  value,
});
