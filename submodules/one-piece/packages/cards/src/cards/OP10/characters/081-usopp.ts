import type { CharacterCard } from "@tcg/op-types";
import { op10Usopp081I18n } from "./081-usopp.i18n.ts";

export const op10Usopp081: CharacterCard = {
  id: "OP10-081",
  canonicalId: "OP10-081",
  slug: "usopp/op10-081",
  name: "Usopp",
  printings: [
    {
      id: "OP10-081",
      artId: "OP10-081",
      setCode: "OP10",
      collectorNumber: "081",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-081.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "ranged",
  effect:
    '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: K.O. up to 1 of your opponent\'s Characters with a cost of 2 or less. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "leader",
              },
              {
                filter: "cardCategory",
                value: "stage",
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
                  value: 2,
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
  i18n: op10Usopp081I18n,
};
