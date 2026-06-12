import type { CharacterCard } from "@tcg/op-types";
import { prb02ScratchmenApooEb01015Reprint015I18n } from "./015-scratchmen-apoo-eb01-015-reprint.i18n.ts";

export const prb02ScratchmenApooEb01015Reprint015: CharacterCard = {
  id: "EB01-015",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-015_p1.jpg",
      imageId: "EB01-015_p1",
    },
  ],
  effect:
    '[On Play] Rest up to 1 of your opponent\'s Characters with a cost of 2 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02ScratchmenApooEb01015Reprint015I18n,
};
