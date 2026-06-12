import type { CharacterCard } from "@tcg/op-types";
import { op09Richie054I18n } from "./054-richie.i18n.ts";

export const op09Richie054: CharacterCard = {
  id: "OP09-054",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Cross Guild"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09Richie054I18n,
};
