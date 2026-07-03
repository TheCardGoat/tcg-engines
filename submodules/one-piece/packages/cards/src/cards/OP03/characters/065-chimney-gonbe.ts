import type { CharacterCard } from "@tcg/op-types";
import { op03ChimneyGonbe065I18n } from "./065-chimney-gonbe.i18n.ts";

export const op03ChimneyGonbe065: CharacterCard = {
  id: "OP03-065",
  canonicalId: "OP03-065",
  slug: "chimney-gonbe",
  name: "Chimney & Gonbe",
  printings: [
    {
      id: "OP03-065",
      artId: "OP03-065",
      setCode: "OP03",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Water Seven"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03ChimneyGonbe065I18n,
};
