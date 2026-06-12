import type { CharacterCard } from "@tcg/op-types";
import { op02Blenheim012I18n } from "./012-blenheim.i18n.ts";

export const op02Blenheim012: CharacterCard = {
  id: "OP02-012",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op02Blenheim012I18n,
};
