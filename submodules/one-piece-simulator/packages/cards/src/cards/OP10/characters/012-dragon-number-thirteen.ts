import type { CharacterCard } from "@tcg/op-types";
import { op10DragonNumberThirteen012I18n } from "./012-dragon-number-thirteen.i18n.ts";

export const op10DragonNumberThirteen012: CharacterCard = {
  id: "OP10-012",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Biological Weapon Punk Hazard"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op10DragonNumberThirteen012I18n,
};
