import type { CharacterCard } from "@tcg/op-types";
import { prb02EdwardNewgateSt15002Reprint002I18n } from "./002-edward-newgate-st15-002-reprint.i18n.ts";

export const prb02EdwardNewgateSt15002Reprint002: CharacterCard = {
  id: "ST15-002",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 8000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST15-002_p2.jpg",
      imageId: "ST15-002_p2",
    },
  ],
  effect:
    '[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.[Activate: Main] You may rest this Character: K.O. up to 1 of your opponent\'s Characters with 5000 power or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02EdwardNewgateSt15002Reprint002I18n,
};
