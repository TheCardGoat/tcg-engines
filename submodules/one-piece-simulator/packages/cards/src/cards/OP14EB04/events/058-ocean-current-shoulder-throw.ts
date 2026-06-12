import type { EventCard } from "@tcg/op-types";
import { op14eb04OceanCurrentShoulderThrow058I18n } from "./058-ocean-current-shoulder-throw.i18n.ts";

export const op14eb04OceanCurrentShoulderThrow058: EventCard = {
  id: "OP14-058",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 2,
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  effect:
    "[Main] You may rest 3 of your DON!! cards: Play up to 1 {Fish-Man} type Character card with a cost of 3 or less from your hand. Then, return up to 1 Character with 6000 base power to the owner's hand.\n[Counter] Draw 1 card and your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Fish-Man",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "eq",
                  value: 6000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
  i18n: op14eb04OceanCurrentShoulderThrow058I18n,
};
