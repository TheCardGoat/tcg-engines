import type { CharacterCard } from "@tcg/op-types";
import { op01DraculeMihawk070I18n } from "./070-dracule-mihawk.i18n.ts";

export const op01DraculeMihawk070: CharacterCard = {
  id: "OP01-070",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP01",
  cost: 9,
  power: 9000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-070_p1.jpg",
      imageId: "OP01-070_p1",
    },
  ],
  effect:
    "[On Play] Place up to 1 Character with a cost of 7 or less at the bottom of the owner's deck.  This card has been officially errata'd.",
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
                  value: 7,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op01DraculeMihawk070I18n,
};
