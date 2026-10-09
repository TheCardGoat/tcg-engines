import type { CharacterCard } from "@tcg/op-types";
import { st05Ann003I18n } from "./st05-003-ann.i18n.ts";

export const st05Ann003: CharacterCard = {
  id: "ST05-003",
  canonicalId: "ST05-003",
  slug: "ann/st05-003",
  name: "Ann",
  printings: [
    {
      id: "ST05-003",
      artId: "ST05-003",
      setCode: "ST05",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-003.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 2,
  power: 3000,
  traits: ["FILM", "The Pirates Fest"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: st05Ann003I18n,
};
