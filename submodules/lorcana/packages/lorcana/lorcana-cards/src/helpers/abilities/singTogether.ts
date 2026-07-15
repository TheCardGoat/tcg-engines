import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export const singTogether = (value: number): KeywordAbilityDefinition => ({
  keyword: "SingTogether",
  text: `Sing Together ${value}`,
  type: "keyword",
  value,
});
