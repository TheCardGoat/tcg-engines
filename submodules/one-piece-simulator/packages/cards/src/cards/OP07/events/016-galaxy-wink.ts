import type { EventCard } from "@tcg/op-types";
import { op07GalaxyWink016I18n } from "./016-galaxy-wink.i18n.ts";

export const op07GalaxyWink016: EventCard = {
  id: "OP07-016",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  traits: ["Revolutionary Army"],
  effect:
    "[Main] Up to 1 of your [Revolutionary Army] type Characters gains +2000 power during this turn. Then, give up to 1 of your opponent's Characters -1000 power during this turn. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
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
                  value: "Revolutionary Army",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
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
            value: -1000,
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
  i18n: op07GalaxyWink016I18n,
};
