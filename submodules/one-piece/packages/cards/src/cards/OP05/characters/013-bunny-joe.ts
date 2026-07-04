import type { CharacterCard } from "@tcg/op-types";
import { op05BunnyJoe013I18n } from "./013-bunny-joe.i18n.ts";

export const op05BunnyJoe013: CharacterCard = {
  id: "OP05-013",
  canonicalId: "OP05-013",
  slug: "bunny-joe",
  name: "Bunny Joe",
  printings: [
    {
      id: "OP05-013",
      artId: "OP05-013",
      setCode: "OP05",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-013.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05BunnyJoe013I18n,
};
