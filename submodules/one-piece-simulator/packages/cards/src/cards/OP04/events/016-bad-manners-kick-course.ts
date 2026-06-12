import type { EventCard } from "@tcg/op-types";
import { op04BadMannersKickCourse016I18n } from "./016-bad-manners-kick-course.i18n.ts";

export const op04BadMannersKickCourse016: EventCard = {
  id: "OP04-016",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP04",
  cost: 0,
  traits: ["Alabasta Straw Hat Crew"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Give up to 1 of your opponent's Leader or Character cards -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04BadMannersKickCourse016I18n,
};
