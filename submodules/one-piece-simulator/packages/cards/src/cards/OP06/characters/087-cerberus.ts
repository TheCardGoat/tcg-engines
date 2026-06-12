import type { CharacterCard } from "@tcg/op-types";
import { op06Cerberus087I18n } from "./087-cerberus.i18n.ts";

export const op06Cerberus087: CharacterCard = {
  id: "OP06-087",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op06Cerberus087I18n,
};
