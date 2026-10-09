import type { EventCard } from "@tcg/op-types";
import { st08GumGumBell014I18n } from "./st08-014-gum-gum-bell.i18n.ts";
export const st08GumGumBell014: EventCard = {
  id: "ST08-014",
  canonicalId: "ST08-014",
  slug: "gum-gum-bell/st08-014",
  name: "Gum-Gum Bell",
  printings: [
    {
      id: "ST08-014",
      artId: "ST08-014",
      setCode: "ST08",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-014.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Straw Hat Crew"],
  cost: 2,
  effect:
    "[Main] You may add 1 card from the top of your Life cards to your hand: Give up to 1 of your opponent's Characters −7 cost during this turn.",
  trigger:
    "Add up to 1 black Character card with a cost of 2 or less from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -7,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st08GumGumBell014I18n,
};
