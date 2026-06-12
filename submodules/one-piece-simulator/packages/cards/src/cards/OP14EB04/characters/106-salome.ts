import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Salome106I18n } from "./106-salome.i18n.ts";

export const op14eb04Salome106: CharacterCard = {
  id: "OP14-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 1000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Animal Amazon Lily"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op14eb04Salome106I18n,
};
