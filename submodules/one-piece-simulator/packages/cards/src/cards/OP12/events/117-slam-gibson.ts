import type { EventCard } from "@tcg/op-types";
import { op12SlamGibson117I18n } from "./117-slam-gibson.i18n.ts";

export const op12SlamGibson117: EventCard = {
  id: "OP12-117",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  traits: ["Kid Pirates Supernovas"],
  effect:
    '[Main] You may rest 5 of your DON!! cards: If your Leader has the "Supernovas" type, add up to 1 Character with a cost of 9 or less to the top or bottom of the owner\'s Life cards face-down.\n[Counter] Your Leader gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 9,
                },
              ],
            },
            position: "top",
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
  i18n: op12SlamGibson117I18n,
};
