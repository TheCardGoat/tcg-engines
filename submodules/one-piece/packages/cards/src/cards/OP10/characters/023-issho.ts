import type { CharacterCard } from "@tcg/op-types";
import { op10Issho023I18n } from "./023-issho.i18n.ts";

export const op10Issho023: CharacterCard = {
  id: "OP10-023",
  canonicalId: "OP10-023",
  slug: "issho/op10-023",
  name: "Issho",
  printings: [
    {
      id: "OP10-023",
      artId: "OP10-023",
      setCode: "OP10",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-023.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy Dressrosa"],
  attribute: "slash",
  effect:
    '[On Play] If your Leader has the "Navy" type, rest up to 2 of your opponent\'s Characters with a cost of 5 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "includes",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10Issho023I18n,
};
