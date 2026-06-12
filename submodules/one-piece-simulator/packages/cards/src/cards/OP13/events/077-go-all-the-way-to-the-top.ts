import type { EventCard } from "@tcg/op-types";
import { op13GoAllTheWayToTheTop077I18n } from "./077-go-all-the-way-to-the-top.i18n.ts";

export const op13GoAllTheWayToTheTop077: EventCard = {
  id: "OP13-077",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  traits: ["Former Roger Pirates"],
  effect:
    "[Main] You may rest 3 of your DON!! cards: If you have any DON!! cards given, K.O. up to 1 of your opponent's Characters with 4000 base power or less and up to 1 of your opponent's Characters with 3000 base power or less.\n[Counter] Your Leader gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13GoAllTheWayToTheTop077I18n,
};
