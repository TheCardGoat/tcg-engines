import type { CharacterCard } from "@tcg/op-types";
import { op02Nekomamushi038I18n } from "./038-nekomamushi.i18n.ts";

export const op02Nekomamushi038: CharacterCard = {
  id: "OP02-038",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  power: 4000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op02Nekomamushi038I18n,
};
