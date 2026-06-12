import type { CharacterCard } from "@tcg/op-types";
import { prb02CrocodileP082PirateFoil082I18n } from "./082-crocodile-p-082-pirate-foil.i18n.ts";

export const prb02CrocodileP082PirateFoil082: CharacterCard = {
  id: "P-082",
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-082_r1.jpg",
      imageId: "P-082_r1",
    },
  ],
  effect:
    "[Your Turn] [On Play] If your Leader has the {Cross Guild} type or a type including \"Baroque Works\", place up to 1 of your opponent's Characters with 2000 power or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Cross Guild",
              },
              {
                condition: "leaderTrait",
                trait: "Baroque Works",
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
                  value: 2000,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02CrocodileP082PirateFoil082I18n,
};
