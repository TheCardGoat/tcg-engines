import type { CharacterCard } from "@tcg/op-types";
import { op02Inazuma050I18n } from "./050-inazuma.i18n.ts";

export const op02Inazuma050: CharacterCard = {
  id: "OP02-050",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "slash",
  effect:
    "If you have 1 or less cards in your hand, this Character gains +2000 power. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op02Inazuma050I18n,
};
