import type { CharacterCard } from "@tcg/op-types";
import { op01King096I18n } from "./096-king.i18n.ts";

export const op01King096: CharacterCard = {
  id: "OP01-096",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP01",
  cost: 7,
  power: 7000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-096_p1.jpg",
      imageId: "OP01-096_p1",
    },
  ],
  effect:
    "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 3 or less and up to 1 of your opponent's Characters with a cost of 2 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
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
  i18n: op01King096I18n,
};
