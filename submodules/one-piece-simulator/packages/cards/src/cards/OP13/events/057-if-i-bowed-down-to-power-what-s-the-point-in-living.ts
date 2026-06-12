import type { EventCard } from "@tcg/op-types";
import { op13IfIBowedDownToPowerWhatSThePointInLiving057I18n } from "./057-if-i-bowed-down-to-power-what-s-the-point-in-living.i18n.ts";

export const op13IfIBowedDownToPowerWhatSThePointInLiving057: EventCard = {
  id: "OP13-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: If you have 1 or less Life cards, your opponent cannot activate [Blocker] whenever your Leader attacks during this turn.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
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
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13IfIBowedDownToPowerWhatSThePointInLiving057I18n,
};
