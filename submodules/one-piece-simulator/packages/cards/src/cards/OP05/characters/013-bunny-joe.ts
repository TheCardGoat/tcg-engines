import type { CharacterCard } from "@tcg/op-types";
import { op05BunnyJoe013I18n } from "./013-bunny-joe.i18n.ts";

export const op05BunnyJoe013: CharacterCard = {
  id: "OP05-013",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05BunnyJoe013I18n,
};
