import type { LeaderCard } from "@tcg/op-types";
import { op10CaesarClown002I18n } from "./002-caesar-clown.i18n.ts";

export const op10CaesarClown002: LeaderCard = {
  id: "OP10-002",
  canonicalId: "OP10-002",
  slug: "caesar-clown/op10-002",
  name: "Caesar Clown",
  printings: [
    {
      id: "OP10-002",
      artId: "OP10-002",
      setCode: "OP10",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-002.jpg",
    },
    {
      id: "OP10-002_p1",
      artId: "OP10-002_p1",
      setCode: "OP10",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-002_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 4,
  traits: ["Punk Hazard Scientist"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-002_p1.jpg",
      imageId: "OP10-002_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking] You may return 1 of your {Punk Hazard} type Characters with a cost of 2 or more to the owner's hand: K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Punk Hazard",
                match: "includes",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
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
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10CaesarClown002I18n,
};
