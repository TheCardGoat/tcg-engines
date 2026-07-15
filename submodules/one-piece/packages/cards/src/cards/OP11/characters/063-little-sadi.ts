import type { CharacterCard } from "@tcg/op-types";
import { op11LittleSadi063I18n } from "./063-little-sadi.i18n.ts";

export const op11LittleSadi063: CharacterCard = {
  id: "OP11-063",
  canonicalId: "OP11-063",
  slug: "little-sadi/op11-063",
  name: "Little Sadi",
  printings: [
    {
      id: "OP11-063",
      artId: "OP11-063",
      setCode: "OP11",
      collectorNumber: "063",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-063.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  effect:
    '[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the "Impel Down" type, rest up to 1 of your opponent\'s Characters with a cost of 3 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
          },
        ],
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
  i18n: op11LittleSadi063I18n,
};
