import type { EventCard } from "@tcg/op-types";
import { op07IronBody095I18n } from "./095-iron-body.i18n.ts";

export const op07IronBody095: EventCard = {
  id: "OP07-095",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  traits: ["CP9"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 10 or more cards in your trash, that card gains an additional +2000 power during this battle. [Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
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
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07IronBody095I18n,
};
