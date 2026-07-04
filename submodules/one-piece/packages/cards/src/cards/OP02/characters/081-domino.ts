import type { CharacterCard } from "@tcg/op-types";
import { op02Domino081I18n } from "./081-domino.i18n.ts";

export const op02Domino081: CharacterCard = {
  id: "OP02-081",
  canonicalId: "OP02-081",
  slug: "domino",
  name: "Domino",
  printings: [
    {
      id: "OP02-081",
      artId: "OP02-081",
      setCode: "OP02",
      collectorNumber: "081",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-081.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op02Domino081I18n,
};
