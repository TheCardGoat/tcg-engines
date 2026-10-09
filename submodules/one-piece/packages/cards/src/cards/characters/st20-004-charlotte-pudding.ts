import type { CharacterCard } from "@tcg/op-types";
import { st20CharlottePudding004I18n } from "./st20-004-charlotte-pudding.i18n.ts";
export const st20CharlottePudding004: CharacterCard = {
  id: "ST20-004",
  canonicalId: "ST20-004",
  slug: "charlotte-pudding/st20-004",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "ST20-004",
      artId: "ST20-004",
      setCode: "ST20",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST20-004.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST20",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] You may add 1 card from the top of your Life cards to your hand: Set up to 1 of your {Big Mom Pirates} type Characters with a cost of 3 or less as active.",
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Big Mom Pirates",
                  match: "exact",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st20CharlottePudding004I18n,
};
