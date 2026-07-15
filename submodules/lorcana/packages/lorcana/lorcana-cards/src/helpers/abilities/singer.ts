import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export const singer = (value: number): KeywordAbilityDefinition => ({
  keyword: "Singer",
  text: `Singer ${value}`,
  type: "keyword",
  value,
});
