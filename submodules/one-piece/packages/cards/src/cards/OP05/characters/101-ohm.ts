import type { CharacterCard } from "@tcg/op-types";
import { op05Ohm101I18n } from "./101-ohm.i18n.ts";

export const op05Ohm101: CharacterCard = {
  id: "OP05-101",
  canonicalId: "OP05-101",
  slug: "ohm",
  name: "Ohm",
  printings: [
    {
      id: "OP05-101",
      artId: "OP05-101",
      setCode: "OP05",
      collectorNumber: "101",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "slash",
  effect:
    "If you have 2 or less Life cards, this Character gains +1000 power. [On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Holly] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Holly] from your hand.",
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
                filter: "name",
                value: "Holly",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Holly",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op05Ohm101I18n,
};
