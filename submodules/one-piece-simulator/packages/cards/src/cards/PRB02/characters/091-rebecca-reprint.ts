import type { CharacterCard } from "@tcg/op-types";
import { prb02RebeccaReprint091I18n } from "./091-rebecca-reprint.i18n.ts";

export const prb02RebeccaReprint091: CharacterCard = {
  id: "OP05-091",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 0,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_p1_LMalLg1.jpg",
      imageId: "OP05-091_p1",
    },
  ],
  effect:
    '[Blocker][On Play] Add up to 1 black Character card with a cost of 3 to 7 other than [Rebecca] from your trash to your hand. Then, play up to 1 black Character card with a cost of 3 or less from your hand rested.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
              ],
            },
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02RebeccaReprint091I18n,
};
