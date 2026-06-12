import type { EventCard } from "@tcg/op-types";
import { op04DragonTwisterDemolitionBreath057I18n } from "./057-dragon-twister-demolition-breath.i18n.ts";

export const op04DragonTwisterDemolitionBreath057: EventCard = {
  id: "OP04-057",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, place up to 1 Character with a cost of 1 or less at the bottom of the owner's deck. [Trigger] Return up to 1 Character with a cost of 6 or less to the owner's hand.",
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "returnToDeck",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
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
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04DragonTwisterDemolitionBreath057I18n,
};
