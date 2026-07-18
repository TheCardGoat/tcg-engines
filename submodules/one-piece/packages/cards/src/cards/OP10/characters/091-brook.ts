import type { CharacterCard } from "@tcg/op-types";
import { op10Brook091I18n } from "./091-brook.i18n.ts";

export const op10Brook091: CharacterCard = {
  id: "OP10-091",
  canonicalId: "OP10-091",
  slug: "brook/op10-091",
  name: "Brook",
  printings: [
    {
      id: "OP10-091",
      artId: "OP10-091",
      setCode: "OP10",
      collectorNumber: "091",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-091.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: K.O. up to 1 of your opponent\'s Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "leader",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                  ],
                ],
              },
            ],
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
                  value: 1,
                },
              ],
            },
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Brook091I18n,
};
