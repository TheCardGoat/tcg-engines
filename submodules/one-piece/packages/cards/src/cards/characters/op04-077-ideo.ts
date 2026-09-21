import type { CharacterCard } from "@tcg/op-types";
import { op04Ideo077I18n } from "./op04-077-ideo.i18n.ts";

export const op04Ideo077: CharacterCard = {
  id: "OP04-077",
  canonicalId: "OP04-077",
  slug: "ideo",
  name: "Ideo",
  printings: [
    {
      id: "OP04-077",
      artId: "OP04-077",
      setCode: "OP04",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077.jpg",
    },
    {
      id: "OP04-077_p1",
      artId: "OP04-077_p1",
      setCode: "OP04",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_p1.jpg",
    },
    {
      id: "OP04-077_r1",
      artId: "OP04-077_r1",
      setCode: "OP04",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_r1.jpg",
      label: "Ideo (Reprint)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op04Ideo077I18n,
};
