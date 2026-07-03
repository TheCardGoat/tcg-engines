import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Bepo012I18n } from "./012-bepo.i18n.ts";

export const op14eb04Bepo012: CharacterCard = {
  id: "OP14-012",
  canonicalId: "OP14-012",
  slug: "bepo/op14-012",
  name: "Bepo",
  printings: [
    {
      id: "OP14-012",
      artId: "OP14-012",
      setCode: "OP14EB04",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-012_3ElUD7M.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Heart Pirates Minks"],
  attribute: "strike",
  effect:
    "[When Attacking] If this Character has 5000 power or more, give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 5000,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Bepo012I18n,
};
