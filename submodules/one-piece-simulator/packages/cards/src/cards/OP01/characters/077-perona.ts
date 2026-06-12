import type { CharacterCard } from "@tcg/op-types";
import { op01Perona077I18n } from "./077-perona.i18n.ts";

export const op01Perona077: CharacterCard = {
  id: "OP01-077",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-077_p1.jpg",
      imageId: "OP01-077_p1",
    },
  ],
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
  i18n: op01Perona077I18n,
};
