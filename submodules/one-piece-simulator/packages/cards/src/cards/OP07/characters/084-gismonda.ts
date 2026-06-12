import type { CharacterCard } from "@tcg/op-types";
import { op07Gismonda084I18n } from "./084-gismonda.i18n.ts";

export const op07Gismonda084: CharacterCard = {
  id: "OP07-084",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op07Gismonda084I18n,
};
