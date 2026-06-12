import type { CharacterCard } from "@tcg/op-types";
import { eb02Vegapunk056I18n } from "./056-vegapunk.i18n.ts";

export const eb02Vegapunk056: CharacterCard = {
  id: "EB02-056",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB02",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-056_p1.png",
      imageId: "EB02-056_p1",
    },
  ],
  effect:
    '[Blocker][On Play] Look at 5 cards from the top of your deck; play up to 1 "Scientist" type Character card with a cost of 5 or less other than [Vegapunk]. Then, place the rest at the bottom of your deck in any order and if your opponent has 2 or less Characters, trash 1 card from your hand.[Trigger] Draw 1 card.',
  effects: {
    keywords: ["blocker"],
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
                filter: "excludeName",
                value: "Vegapunk",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Scientist",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb02Vegapunk056I18n,
};
