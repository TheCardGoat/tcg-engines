import type { CharacterCard } from "@tcg/op-types";
import { op16NicoRobin092I18n } from "./op16-092-nico-robin.i18n.ts";

export const op16NicoRobin092: CharacterCard = {
  id: "OP16-092",
  canonicalId: "OP16-092",
  slug: "nico-robin/op16-092",
  name: "Nico Robin",
  printings: [
    {
      id: "OP16-092",
      artId: "OP16-092",
      setCode: "OP16",
      collectorNumber: "092",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-092_sgaCnPy.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 Character card with a cost of 8 or more from your hand: Draw 2 cards.",
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
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16NicoRobin092I18n,
};
