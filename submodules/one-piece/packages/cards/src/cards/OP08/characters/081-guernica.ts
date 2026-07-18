import type { CharacterCard } from "@tcg/op-types";
import { op08Guernica081I18n } from "./081-guernica.i18n.ts";

export const op08Guernica081: CharacterCard = {
  id: "OP08-081",
  canonicalId: "OP08-081",
  slug: "guernica",
  name: "Guernica",
  printings: [
    {
      id: "OP08-081",
      artId: "OP08-081",
      setCode: "OP08",
      collectorNumber: "081",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-081.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    '[When Attacking] You may place 3 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 0.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 3,
            position: "bottom",
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Guernica081I18n,
};
