import type { CharacterCard } from "@tcg/op-types";
import { op03Lim015I18n } from "./015-lim.i18n.ts";

export const op03Lim015: CharacterCard = {
  id: "OP03-015",
  canonicalId: "OP03-015",
  slug: "lim/op03-015",
  name: "Lim",
  printings: [
    {
      id: "OP03-015",
      artId: "OP03-015",
      setCode: "OP03",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-015.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 2000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03Lim015I18n,
};
