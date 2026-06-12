import type { CharacterCard } from "@tcg/op-types";
import { op02Mr2BonKureiBentham064I18n } from "./064-mr-2-bon-kurei-bentham.i18n.ts";

export const op02Mr2BonKureiBentham064: CharacterCard = {
  id: "OP02-064",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] You may trash 1 card from your hand: Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck. Then, at the end of this battle, place this Character at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02Mr2BonKureiBentham064I18n,
};
