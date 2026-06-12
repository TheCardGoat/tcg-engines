import type { CharacterCard } from "@tcg/op-types";
import { op08WhosWho091I18n } from "./091-whos-who.i18n.ts";

export const op08WhosWho091: CharacterCard = {
  id: "OP08-091",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates Former CP9"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 3 or less. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08WhosWho091I18n,
};
