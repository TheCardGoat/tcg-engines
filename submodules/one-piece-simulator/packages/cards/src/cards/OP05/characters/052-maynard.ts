import type { CharacterCard } from "@tcg/op-types";
import { op05Maynard052I18n } from "./052-maynard.i18n.ts";

export const op05Maynard052: CharacterCard = {
  id: "OP05-052",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05Maynard052I18n,
};
