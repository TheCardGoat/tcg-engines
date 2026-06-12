import type { EventCard } from "@tcg/op-types";
import { op14eb04FlameDragonTorch040I18n } from "./040-flame-dragon-torch.i18n.ts";

export const op14eb04FlameDragonTorch040: EventCard = {
  id: "EB04-040",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  effect:
    "[Main] You may rest 6 of your DON!! cards: Up to 1 of your [Kaido] cards gains +3000 power during this turn. Then, rest up to 1 of your opponent's Characters.\n[Counter] DON!! 1: Your Leader gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Kaido",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04FlameDragonTorch040I18n,
};
