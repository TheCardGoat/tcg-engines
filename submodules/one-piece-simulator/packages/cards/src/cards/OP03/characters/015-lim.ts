import type { CharacterCard } from "@tcg/op-types";
import { op03Lim015I18n } from "./015-lim.i18n.ts";

export const op03Lim015: CharacterCard = {
  id: "OP03-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 2000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03Lim015I18n,
};
