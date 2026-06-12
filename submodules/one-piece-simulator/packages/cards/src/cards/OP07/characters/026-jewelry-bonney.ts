import type { CharacterCard } from "@tcg/op-types";
import { op07JewelryBonney026I18n } from "./026-jewelry-bonney.i18n.ts";

export const op07JewelryBonney026: CharacterCard = {
  id: "OP07-026",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-026_p1.jpg",
      imageId: "OP07-026_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your opponent's rested Character or DON!! cards will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07JewelryBonney026I18n,
};
