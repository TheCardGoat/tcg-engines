import type { EventCard } from "@tcg/op-types";
import { op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036I18n } from "./036-demonic-aura-nine-sword-style-asura-demon-nine-flash.i18n.ts";

export const op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036: EventCard = {
  id: "OP07-036",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  traits: ["Straw Hat Crew Supernovas"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, you may rest 1 of your Characters with a cost of 3 or more. If you do, rest up to 1 of your opponent's Characters with a cost of 5 or less. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            duration: "thisTurn",
          },
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036I18n,
};
