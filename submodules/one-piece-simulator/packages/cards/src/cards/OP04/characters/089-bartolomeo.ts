import type { CharacterCard } from "@tcg/op-types";
import { op04Bartolomeo089I18n } from "./089-bartolomeo.i18n.ts";

export const op04Bartolomeo089: CharacterCard = {
  id: "OP04-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Dressrosa Barto Club"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op04Bartolomeo089I18n,
};
