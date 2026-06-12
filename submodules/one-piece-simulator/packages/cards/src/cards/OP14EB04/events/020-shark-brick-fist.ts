import type { EventCard } from "@tcg/op-types";
import { op14eb04SharkBrickFist020I18n } from "./020-shark-brick-fist.i18n.ts";

export const op14eb04SharkBrickFist020: EventCard = {
  id: "EB04-020",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  effect:
    "[Counter] Up to 1 of your {Fish-Man} type Leader or Character cards gains +3000 power during this battle. Then, set up to 1 of your {Fish-Man} type Characters as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
              ],
            },
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04SharkBrickFist020I18n,
};
