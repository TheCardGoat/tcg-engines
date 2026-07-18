import type { CharacterCard } from "@tcg/op-types";
import { op11MonkeyDGarp095I18n } from "./095-monkey-d-garp.i18n.ts";

export const op11MonkeyDGarp095: CharacterCard = {
  id: "OP11-095",
  canonicalId: "OP11-095",
  slug: "monkey-d-garp/op11-095",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "OP11-095",
      artId: "OP11-095",
      setCode: "OP11",
      collectorNumber: "095",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-095.jpg",
    },
    {
      id: "OP11-095_p1",
      artId: "OP11-095_p1",
      setCode: "OP11",
      collectorNumber: "095",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-095_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP11",
  cost: 8,
  power: 8000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-095_p1.jpg",
      imageId: "OP11-095_p1",
    },
  ],
  effect:
    '[On Play] You may place 3 "Navy" type cards from your trash at the bottom of your deck in any order: Give up to 1 rested DON!! card to 1 of your Leader. Then, if there is a Character with a cost of 9 or more, K.O. up to 1 of your opponent\'s Characters with a cost of 7 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 3,
            position: "bottom",
            filters: [
              {
                filter: "trait",
                value: "Navy",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
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
                  value: 7,
                },
              ],
            },
            condition: {
              condition: "existsOnField",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 9,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11MonkeyDGarp095I18n,
};
