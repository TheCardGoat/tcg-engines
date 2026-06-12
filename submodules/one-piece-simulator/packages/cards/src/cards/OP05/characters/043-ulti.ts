import type { CharacterCard } from "@tcg/op-types";
import { op05Ulti043I18n } from "./043-ulti.i18n.ts";

export const op05Ulti043: CharacterCard = {
  id: "OP05-043",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-043_p1.jpg",
      imageId: "OP05-043_p1",
    },
  ],
  effect:
    "[On Play] If your Leader is multicolored, look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Ulti043I18n,
};
