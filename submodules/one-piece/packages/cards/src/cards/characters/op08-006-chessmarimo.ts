import type { CharacterCard } from "@tcg/op-types";
import { op08Chessmarimo006I18n } from "./op08-006-chessmarimo.i18n.ts";

export const op08Chessmarimo006: CharacterCard = {
  id: "OP08-006",
  canonicalId: "OP08-006",
  slug: "chessmarimo/op08-006",
  name: "Chessmarimo",
  printings: [
    {
      id: "OP08-006",
      artId: "OP08-006",
      setCode: "OP08",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: ["ranged", "strike"],
  effect:
    "[Your Turn] If you have [Kuromarimo] and [Chess] in your trash, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            value: 2000,
            duration: "permanent",
            condition: {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "trash",
                  filters: [
                    {
                      filter: "name",
                      value: "Kuromarimo",
                    },
                  ],
                },
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "trash",
                  filters: [
                    {
                      filter: "name",
                      value: "Chess",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Chessmarimo006I18n,
};
