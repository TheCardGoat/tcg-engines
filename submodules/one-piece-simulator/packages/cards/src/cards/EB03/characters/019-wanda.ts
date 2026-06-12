import type { CharacterCard } from "@tcg/op-types";
import { eb03Wanda019I18n } from "./019-wanda.i18n.ts";

export const eb03Wanda019: CharacterCard = {
  id: "EB03-019",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: eb03Wanda019I18n,
};
