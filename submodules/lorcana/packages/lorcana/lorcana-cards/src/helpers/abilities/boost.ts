import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

export const boost = (value: number): KeywordAbilityDefinition => ({
  keyword: "Boost",
  text: `Boost ${value} {I} (Once during your turn, you may pay ${value} {I} to put the top card of your deck facedown under this card.)`,
  type: "keyword",
  value,
});
