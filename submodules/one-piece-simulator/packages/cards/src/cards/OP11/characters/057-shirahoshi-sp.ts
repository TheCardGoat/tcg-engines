import type { CharacterCard } from "@tcg/op-types";
import { op11ShirahoshiSp057I18n } from "./057-shirahoshi-sp.i18n.ts";

export const op11ShirahoshiSp057: CharacterCard = {
  id: "EB01-057",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP11",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect:
    "When this Character is K.O.'d by your opponent's effect, add up to 1 card from the top of your deck to the top of your Life cards.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op11ShirahoshiSp057I18n,
};
