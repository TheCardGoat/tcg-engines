import type { CharacterCard } from "@tcg/op-types";
import { prb02IdeoPirateFoil077I18n } from "./077-ideo-pirate-foil.i18n.ts";

export const prb02IdeoPirateFoil077: CharacterCard = {
  id: "OP04-077",
  canonicalId: "OP04-077",
  slug: "ideo-pirate-foil",
  name: "Ideo (Pirate Foil)",
  printings: [
    {
      id: "OP04-077",
      artId: "OP04-077",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_p1.jpg",
    },
    {
      id: "OP04-077_r1",
      artId: "OP04-077_r1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_r1.jpg",
      imageId: "OP04-077_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02IdeoPirateFoil077I18n,
};
