import type { EventCard } from "@tcg/op-types";
import { op05FireFist019I18n } from "./019-fire-fist.i18n.ts";

export const op05FireFist019: EventCard = {
  id: "OP05-019",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  traits: ["Revolutionary Army"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -4000 power during this turn. Then, if you have 2 or less Life cards, K.O. up to 1 of your opponent's Characters with 0 power or less. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op05FireFist019I18n,
};
