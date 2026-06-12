import type { LeaderCard } from "@tcg/op-types";
import { eb02HodyJones020I18n } from "./020-hody-jones.i18n.ts";

export const eb02HodyJones020: LeaderCard = {
  id: "OP06-020",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "strike",
  effect:
    "[Activate: Main] You may rest this Leader: Rest up to 1 of your opponent's DON!! cards or Characters with a cost of 3 or less. Then, you cannot add Life cards to your hand using your own effects during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea", "character"],
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
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
            },
            duration: "thisTurn",
            bySource: "ownEffect",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02HodyJones020I18n,
};
