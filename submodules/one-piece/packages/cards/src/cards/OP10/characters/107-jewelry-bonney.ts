import type { CharacterCard } from "@tcg/op-types";
import { op10JewelryBonney107I18n } from "./107-jewelry-bonney.i18n.ts";

export const op10JewelryBonney107: CharacterCard = {
  id: "OP10-107",
  canonicalId: "OP10-107",
  slug: "jewelry-bonney/op10-107",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "OP10-107",
      artId: "OP10-107",
      setCode: "OP10",
      collectorNumber: "107",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-107.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    '[Blocker]\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 "Supernovas" type Character card with a cost of 5 from your hand to the top of your Life cards face-up.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Supernovas",
                  match: "includes",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 5,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10JewelryBonney107I18n,
};
