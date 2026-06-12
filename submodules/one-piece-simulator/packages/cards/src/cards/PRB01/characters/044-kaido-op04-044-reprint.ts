import type { CharacterCard } from "@tcg/op-types";
import { prb01KaidoOp04044Reprint044I18n } from "./044-kaido-op04-044-reprint.i18n.ts";

export const prb01KaidoOp04044Reprint044: CharacterCard = {
  id: "OP04-044",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB01",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p4.jpg",
      imageId: "OP04-044_p4",
    },
  ],
  effect:
    "[On Play] Return up to 1 Character with a cost of 8 or less and up to 1 Character with a cost of 3 or less to the owner's hand.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01KaidoOp04044Reprint044I18n,
};
