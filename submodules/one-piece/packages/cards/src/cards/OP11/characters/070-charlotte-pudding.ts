import type { CharacterCard } from "@tcg/op-types";
import { op11CharlottePudding070I18n } from "./070-charlotte-pudding.i18n.ts";

export const op11CharlottePudding070: CharacterCard = {
  id: "OP11-070",
  canonicalId: "OP11-070",
  slug: "charlotte-pudding/op11-070",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP11-070",
      artId: "OP11-070",
      setCode: "OP11",
      collectorNumber: "070",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-070.jpg",
    },
    {
      id: "OP11-070_p1",
      artId: "OP11-070_p1",
      setCode: "OP11",
      collectorNumber: "070",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-070_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP11",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-070_p1.jpg",
      imageId: "OP11-070_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Big Mom Pirates" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Activate: Main] DON!! −1, You may rest this Character: Look at 1 card from the top of your opponent\'s deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Big Mom Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "lookAtTopDeckCard",
            player: "opponent",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11CharlottePudding070I18n,
};
