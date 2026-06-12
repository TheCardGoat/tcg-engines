import type { EventCard } from "@tcg/op-types";
import { op05EmporioEnergyHormone018I18n } from "./018-emporio-energy-hormone.i18n.ts";

export const op05EmporioEnergyHormone018: EventCard = {
  id: "OP05-018",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  traits: ["Revolutionary Army"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, play up to 1 [Revolutionary Army] type Character card with 5000 power or less from your hand. [Trigger] Play up to 1 [Revolutionary Army] type Character card with 5000 power or less from your hand.",
  effects: {
    effects: [
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
            },
            value: 3000,
            duration: "thisBattle",
          },
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
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
      {
        trigger: "trigger",
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
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op05EmporioEnergyHormone018I18n,
};
