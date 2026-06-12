import type { CharacterCard } from "@tcg/op-types";
import { prb02ShirahoshiReprint057I18n } from "./057-shirahoshi-reprint.i18n.ts";

export const prb02ShirahoshiReprint057: CharacterCard = {
  id: "EB01-057",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 2,
  power: 0,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect:
    "When this Character is K.O.'d by your opponent's effect, add up to 1 card from the top of your deck to the top of your Life cards.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02ShirahoshiReprint057I18n,
};
