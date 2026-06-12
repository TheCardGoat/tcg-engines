import type { EventCard } from "@tcg/op-types";
import { op03CrossFire017I18n } from "./017-cross-fire.i18n.ts";

export const op03CrossFire017: EventCard = {
  id: "OP03-017",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] / [Counter] If your Leader's type includes \"Whitebeard Pirates\", give up to 1 of your opponent's Characters -4000 power during this turn. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
          },
        ],
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
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
          },
        ],
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
  i18n: op03CrossFire017I18n,
};
