import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboP044PirateFoil044I18n } from "./044-sabo-p-044-pirate-foil.i18n.ts";

export const prb02SaboP044PirateFoil044: CharacterCard = {
  id: "P-044",
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-044_r1.jpg",
      imageId: "P-044_r1",
    },
  ],
  effect: "[DON!! x1] If you have 4 or less cards in your hand, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02SaboP044PirateFoil044I18n,
};
