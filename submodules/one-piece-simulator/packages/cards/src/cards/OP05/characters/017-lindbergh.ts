import type { CharacterCard } from "@tcg/op-types";
import { op05Lindbergh017I18n } from "./017-lindbergh.i18n.ts";

export const op05Lindbergh017: CharacterCard = {
  id: "OP05-017",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Minks Revolutionary Army"],
  attribute: "special",
  effect:
    "[When Attacking] If this Character has 7000 power or more, K.O. up to 1 of your opponent's Characters with 3000 power or less. [Trigger] You may trash 1 card from your hand: If your Leader is multicolored, play this card.",
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
            value: 7000,
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Lindbergh017I18n,
};
