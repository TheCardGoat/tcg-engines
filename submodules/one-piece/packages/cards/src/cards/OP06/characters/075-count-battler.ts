import type { CharacterCard } from "@tcg/op-types";
import { op06CountBattler075I18n } from "./075-count-battler.i18n.ts";

export const op06CountBattler075: CharacterCard = {
  id: "OP06-075",
  canonicalId: "OP06-075",
  slug: "count-battler",
  name: "Count Battler",
  printings: [
    {
      id: "OP06-075",
      artId: "OP06-075",
      setCode: "OP06",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-075.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["FILM Crown Island"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 2 of your opponent's Characters with a cost of 2 or less.",
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
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
      },
    ],
  },
  i18n: op06CountBattler075I18n,
};
