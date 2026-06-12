import type { CharacterCard } from "@tcg/op-types";
import { op05Borsalino051I18n } from "./051-borsalino.i18n.ts";

export const op05Borsalino051: CharacterCard = {
  id: "OP05-051",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP05",
  cost: 7,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-051_p1.jpg",
      imageId: "OP05-051_p1",
    },
  ],
  effect:
    "[On Play] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Borsalino051I18n,
};
