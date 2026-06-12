import type { CharacterCard } from "@tcg/op-types";
import { op12TrafalgarLaw106I18n } from "./106-trafalgar-law.i18n.ts";

export const op12TrafalgarLaw106: CharacterCard = {
  id: "OP12-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12TrafalgarLaw106I18n,
};
