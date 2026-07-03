import type { CharacterCard } from "@tcg/op-types";
import { prb02MaynardPirateFoil052I18n } from "./052-maynard-pirate-foil.i18n.ts";

export const prb02MaynardPirateFoil052: CharacterCard = {
  id: "OP05-052",
  canonicalId: "OP05-052",
  slug: "maynard-pirate-foil",
  name: "Maynard (Pirate Foil)",
  printings: [
    {
      id: "OP05-052",
      artId: "OP05-052",
      setCode: "PRB02",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_p1.jpg",
    },
    {
      id: "OP05-052_r1",
      artId: "OP05-052_r1",
      setCode: "PRB02",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_r1.jpg",
      imageId: "OP05-052_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02MaynardPirateFoil052I18n,
};
