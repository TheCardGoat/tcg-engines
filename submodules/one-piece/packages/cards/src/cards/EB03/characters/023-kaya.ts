import type { CharacterCard } from "@tcg/op-types";
import { eb03Kaya023I18n } from "./023-kaya.i18n.ts";

export const eb03Kaya023: CharacterCard = {
  id: "EB03-023",
  canonicalId: "EB03-023",
  slug: "kaya/eb03-023",
  name: "Kaya",
  printings: [
    {
      id: "EB03-023",
      artId: "EB03-023",
      setCode: "EB03",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-023_2hxgnbe.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: eb03Kaya023I18n,
};
