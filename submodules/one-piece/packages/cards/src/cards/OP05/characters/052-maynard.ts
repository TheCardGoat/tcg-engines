import type { CharacterCard } from "@tcg/op-types";
import { op05Maynard052I18n } from "./052-maynard.i18n.ts";

export const op05Maynard052: CharacterCard = {
  id: "OP05-052",
  canonicalId: "OP05-052",
  slug: "maynard",
  name: "Maynard",
  printings: [
    {
      id: "OP05-052",
      artId: "OP05-052",
      setCode: "OP05",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05Maynard052I18n,
};
