import type { CharacterCard } from "@tcg/op-types";
import { op10Giolla066I18n } from "./066-giolla.i18n.ts";

export const op10Giolla066: CharacterCard = {
  id: "OP10-066",
  canonicalId: "OP10-066",
  slug: "giolla/op10-066",
  name: "Giolla",
  printings: [
    {
      id: "OP10-066",
      artId: "OP10-066",
      setCode: "OP10",
      collectorNumber: "066",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-066.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] You may rest 2 of your DON!! cards: Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 2,
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
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Giolla066I18n,
};
