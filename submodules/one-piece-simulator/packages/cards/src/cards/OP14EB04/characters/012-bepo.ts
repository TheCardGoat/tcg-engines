import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Bepo012I18n } from "./012-bepo.i18n.ts";

export const op14eb04Bepo012: CharacterCard = {
  id: "OP14-012",
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
