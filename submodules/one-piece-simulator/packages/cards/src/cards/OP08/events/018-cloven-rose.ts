import type { EventCard } from "@tcg/op-types";
import { op08ClovenRose018I18n } from "./018-cloven-rose.i18n.ts";

export const op08ClovenRose018: EventCard = {
  id: "OP08-018",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP08",
  cost: 2,
  traits: ["Animal Straw Hat Crew Drum Kingdom"],
  effect:
    "[Main] Up to 3 of your Characters gain +1000 power during this turn. Then, give up to 1 of your opponent's Characters 2000 power during this turn. [Trigger] Give up to 1 of your opponent's Leader or Character cards 3000 power during this turn.",
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
                amount: 3,
                upTo: true,
              },
            },
            value: 1000,
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08ClovenRose018I18n,
};
