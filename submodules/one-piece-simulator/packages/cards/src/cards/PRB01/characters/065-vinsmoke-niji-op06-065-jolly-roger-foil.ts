import type { CharacterCard } from "@tcg/op-types";
import { prb01VinsmokeNijiOp06065JollyRogerFoil065I18n } from "./065-vinsmoke-niji-op06-065-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeNijiOp06065JollyRogerFoil065: CharacterCard = {
  id: "OP06-065",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p3.jpg",
      imageId: "OP06-065_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_r1.png",
      imageId: "OP06-065_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p4.jpg",
      imageId: "OP06-065_p4",
    },
  ],
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, choose one:• K.O. up to 1 of your opponent's Characters with a cost of 2 or less.• Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 2,
                      },
                    ],
                  },
                },
              ],
              [
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
                        value: 4,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: prb01VinsmokeNijiOp06065JollyRogerFoil065I18n,
};
