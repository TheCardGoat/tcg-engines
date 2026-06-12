import type { EventCard } from "@tcg/op-types";
import { op14eb04Eleclaw019I18n } from "./019-eleclaw.i18n.ts";

export const op14eb04Eleclaw019: EventCard = {
  id: "EB04-019",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Minks"],
  effect:
    "[Main] You may rest 1 of your cards: If your Leader has the {Minks} type, give up to 1 of your opponent's Characters -3 cost during this turn.\n[Counter] Up to 1 of your {Minks} type Leader or Character cards gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Minks",
          },
        ],
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                },
              ],
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Eleclaw019I18n,
};
