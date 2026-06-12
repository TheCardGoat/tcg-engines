import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export const challenger = (value: number): KeywordAbilityDefinition => ({
  keyword: "Challenger",
  text: `Challenger +${value}`,
  type: "keyword",
  value,
});
