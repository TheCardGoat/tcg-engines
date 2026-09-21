import type { CharacterCard } from "@tcg/op-types";
import { op17Shiki047I18n } from "./op17-047-shiki.i18n.ts";

export const op17Shiki047: CharacterCard = {
  id: "OP17-047",
  canonicalId: "OP17-047",
  slug: "shiki/op17-047",
  name: "Shiki",
  printings: [
    {
      id: "OP17-047",
      artId: "OP17-047",
      setCode: "OP17",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-047_gKkJfdC.jpg",
      label: "Shiki (047)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 9,
  power: 10000,
  traits: ["FILM Impel Down Golden Lion Pirates"],
  attribute: "slash",
  effect:
    "[End of Your Turn] If you have 2 or less cards in your hand, your opponent places 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op17Shiki047I18n,
};
