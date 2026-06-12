import type { CharacterCard } from "@tcg/op-types";
import { op01TonyTonyChopper015I18n } from "./015-tony-tony-chopper.i18n.ts";

export const op01TonyTonyChopper015: CharacterCard = {
  id: "OP01-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    '[DON!! x1] [When Attacking] You may trash 1 card from your hand: Add up to 1 "Straw Hat Crew" type Character card other than [Tony Tony.Chopper] with a cost of 4 or less from your trash to your hand.  This card has been officially errata\'d.',
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
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "excludeName",
                  value: "Tony Tony.Chopper",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01TonyTonyChopper015I18n,
};
