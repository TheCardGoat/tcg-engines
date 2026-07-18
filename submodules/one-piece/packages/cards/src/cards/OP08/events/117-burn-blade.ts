import type { EventCard } from "@tcg/op-types";
import { op08BurnBlade117I18n } from "./117-burn-blade.i18n.ts";

export const op08BurnBlade117: EventCard = {
  id: "OP08-117",
  canonicalId: "OP08-117",
  slug: "burn-blade",
  name: "Burn Blade",
  printings: [
    {
      id: "OP08-117",
      artId: "OP08-117",
      setCode: "OP08",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-117.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  traits: ["Sky Island Shandian Warrior"],
  effect:
    "[Main] You may trash 1 card from the top of your Life cards: K.O. up to 1 of your opponent's Characters with a cost of 7 or less. [Trigger] You may add 1 card from the top of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [{ cost: "trashLife", amount: 1, position: "top" }],
        actions: [
          {
            action: "ko",
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
                  value: 7,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        costs: [{ cost: "addLifeToHand", amount: 1, position: "top" }],
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
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08BurnBlade117I18n,
};
