import type { CharacterCard } from "@tcg/op-types";
import { op02MonkeyDLuffy062I18n } from "./062-monkey-d-luffy.i18n.ts";

export const op02MonkeyDLuffy062: CharacterCard = {
  id: "OP02-062",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP02",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Impel Down"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-062_p1.jpg",
      imageId: "OP02-062_p1",
    },
  ],
  effect:
    "[On Play] / [When Attacking] You may trash 2 cards from your hand: Return up to 1 Character with a cost of 4 or less to the owner's hand. Then, this Character gains [Double Attack] during this turn. (This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02MonkeyDLuffy062I18n,
};
