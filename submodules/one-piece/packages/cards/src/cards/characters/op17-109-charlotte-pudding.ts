import type { CharacterCard } from "@tcg/op-types";
import { op17CharlottePudding109I18n } from "./op17-109-charlotte-pudding.i18n.ts";

export const op17CharlottePudding109: CharacterCard = {
  id: "OP17-109",
  canonicalId: "OP17-109",
  slug: "charlotte-pudding/op17-109",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP17-109",
      artId: "OP17-109",
      setCode: "OP17",
      collectorNumber: "109",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-109_brUDWS0.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP17",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger:
    "Look at 5 cards from the top of your deck; reveal up to 1 {Big Mom Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect: "[On Play] You may trash 1 card with a [Trigger] from your hand: Draw 3 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
    ],
  },
  i18n: op17CharlottePudding109I18n,
};
