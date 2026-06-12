import type { CharacterCard } from "@tcg/op-types";
import { op04Kaido044I18n } from "./044-kaido.i18n.ts";

export const op04Kaido044: CharacterCard = {
  id: "OP04-044",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP04",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p1.jpg",
      imageId: "OP04-044_p1",
    },
  ],
  effect:
    "[On Play] Return up to 1 Character with a cost of 8 or less and up to 1 Character with a cost of 3 or less to the owner's hand.",
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
                  value: 8,
                },
              ],
            },
          },
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Kaido044I18n,
};
