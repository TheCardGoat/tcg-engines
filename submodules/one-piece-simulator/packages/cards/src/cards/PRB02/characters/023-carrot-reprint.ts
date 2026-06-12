import type { CharacterCard } from "@tcg/op-types";
import { prb02CarrotReprint023I18n } from "./023-carrot-reprint.i18n.ts";

export const prb02CarrotReprint023: CharacterCard = {
  id: "OP08-023",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_p1_8FjIUrx.jpg",
      imageId: "OP08-023_p1",
    },
  ],
  effect:
    "[On Play]/[When Attacking] Up to 1 of your opponent's rested Characters with a cost of 7 or less will not become active in your opponent's next Refresh Phase.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02CarrotReprint023I18n,
};
