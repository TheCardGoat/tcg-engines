import type { EventCard } from "@tcg/op-types";
import { prb02GumGumRainReprint068I18n } from "./068-gum-gum-rain-reprint.i18n.ts";

export const prb02GumGumRainReprint068: EventCard = {
  id: "OP02-068",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 0,
  traits: ["Straw Hat Crew Impel Down"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-068_p1.jpg",
      imageId: "OP02-068_p1",
    },
  ],
  effect:
    '[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] Return up to 1 Character with a cost of 2 or less to the owner\'s hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
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
          },
        ],
      },
    ],
  },
  i18n: prb02GumGumRainReprint068I18n,
};
