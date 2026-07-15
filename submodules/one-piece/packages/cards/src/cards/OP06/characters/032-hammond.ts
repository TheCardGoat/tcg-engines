import type { CharacterCard } from "@tcg/op-types";
import { op06Hammond032I18n } from "./032-hammond.i18n.ts";

export const op06Hammond032: CharacterCard = {
  id: "OP06-032",
  canonicalId: "OP06-032",
  slug: "hammond",
  name: "Hammond",
  printings: [
    {
      id: "OP06-032",
      artId: "OP06-032",
      setCode: "OP06",
      collectorNumber: "032",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-032.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op06Hammond032I18n,
};
