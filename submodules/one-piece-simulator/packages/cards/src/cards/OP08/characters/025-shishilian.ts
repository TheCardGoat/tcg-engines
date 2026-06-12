import type { CharacterCard } from "@tcg/op-types";
import { op08Shishilian025I18n } from "./025-shishilian.i18n.ts";

export const op08Shishilian025: CharacterCard = {
  id: "OP08-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[On Play] Up to 1 of your opponent's rested Characters with a cost of 3 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
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
  i18n: op08Shishilian025I18n,
};
