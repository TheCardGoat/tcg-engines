import type { CharacterCard } from "@tcg/op-types";
import { op10Kyros046I18n } from "./046-kyros.i18n.ts";

export const op10Kyros046: CharacterCard = {
  id: "OP10-046",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP10",
  cost: 7,
  power: 9000,
  traits: ["Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-046_p1.jpg",
      imageId: "OP10-046_p1",
    },
  ],
  effect: "[On Play] Return up to 1 Character with a cost of 5 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10Kyros046I18n,
};
