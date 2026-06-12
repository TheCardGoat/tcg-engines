import type { CharacterCard } from "@tcg/op-types";
import { op03ChimneyGonbe065I18n } from "./065-chimney-gonbe.i18n.ts";

export const op03ChimneyGonbe065: CharacterCard = {
  id: "OP03-065",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Water Seven"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03ChimneyGonbe065I18n,
};
