import type { EventCard } from "@tcg/op-types";
import { prb01NarikaburaArrowJollyRogerFoil014I18n } from "./014-narikabura-arrow-jolly-roger-foil.i18n.ts";

export const prb01NarikaburaArrowJollyRogerFoil014: EventCard = {
  id: "ST09-014",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Land of Wano"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST09-014_p3.jpg",
      imageId: "ST09-014_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST09-014_r1.png",
      imageId: "ST09-014_r1",
    },
  ],
  effect:
    "[Counter] If you have 2 or less Life cards, give up to 1 of your opponent's Leader or Character cards -3000 power during this turn.[Trigger] You may trash 2 cards from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
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
  i18n: prb01NarikaburaArrowJollyRogerFoil014I18n,
};
