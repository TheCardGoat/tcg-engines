import type { CharacterCard } from "@tcg/op-types";
import { op03Fukurou088I18n } from "./088-fukurou.i18n.ts";

export const op03Fukurou088: CharacterCard = {
  id: "OP03-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    "This Character cannot be K.O.'d by effects. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03Fukurou088I18n,
};
