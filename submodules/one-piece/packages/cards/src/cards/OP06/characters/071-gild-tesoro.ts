import type { CharacterCard } from "@tcg/op-types";
import { op06GildTesoro071I18n } from "./071-gild-tesoro.i18n.ts";

export const op06GildTesoro071: CharacterCard = {
  id: "OP06-071",
  canonicalId: "OP06-071",
  slug: "gild-tesoro",
  name: "Gild Tesoro",
  printings: [
    {
      id: "OP06-071",
      artId: "OP06-071",
      setCode: "OP06",
      collectorNumber: "071",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-071.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM", "Grantesoro"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [FILM] type, add up to 2 [FILM] type Character cards with a cost of 4 or less from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "includes",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "FILM",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06GildTesoro071I18n,
};
