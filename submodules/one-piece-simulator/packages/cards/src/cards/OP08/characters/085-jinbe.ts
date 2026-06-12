import type { CharacterCard } from "@tcg/op-types";
import { op08Jinbe085I18n } from "./085-jinbe.i18n.ts";

export const op08Jinbe085: CharacterCard = {
  id: "OP08-085",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  power: 6000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] If you have a Character with a cost of 8 or more, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Jinbe085I18n,
};
