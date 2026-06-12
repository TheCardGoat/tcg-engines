import type { CharacterCard } from "@tcg/op-types";
import { op07Caribou023I18n } from "./023-caribou.i18n.ts";

export const op07Caribou023: CharacterCard = {
  id: "OP07-023",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "special",
  effect:
    "If you have 6 or more rested DON!! cards, this Character gains +1000 power. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op07Caribou023I18n,
};
