import type { CharacterCard } from "@tcg/op-types";
import { op06Hammond032I18n } from "./032-hammond.i18n.ts";

export const op06Hammond032: CharacterCard = {
  id: "OP06-032",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op06Hammond032I18n,
};
