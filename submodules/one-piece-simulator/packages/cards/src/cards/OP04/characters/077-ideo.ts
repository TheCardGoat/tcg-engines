import type { CharacterCard } from "@tcg/op-types";
import { op04Ideo077I18n } from "./077-ideo.i18n.ts";

export const op04Ideo077: CharacterCard = {
  id: "OP04-077",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op04Ideo077I18n,
};
