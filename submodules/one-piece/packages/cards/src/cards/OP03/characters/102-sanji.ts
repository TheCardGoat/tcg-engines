import type { CharacterCard } from "@tcg/op-types";
import { op03Sanji102I18n } from "./102-sanji.i18n.ts";

export const op03Sanji102: CharacterCard = {
  id: "OP03-102",
  canonicalId: "OP03-102",
  slug: "sanji/op03-102",
  name: "Sanji",
  printings: [
    {
      id: "OP03-102",
      artId: "OP03-102",
      setCode: "OP03",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-102.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP03",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["The Vinsmoke Family"],
  attribute: "strike",
  effect:
    "[DON!! x2] [When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
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
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Sanji102I18n,
};
