import type { EventCard } from "@tcg/op-types";
import { op13TheWorldSEquilibriumCannotBeMaintainedForever097I18n } from "./097-the-world-s-equilibrium-cannot-be-maintained-forever.i18n.ts";

export const op13TheWorldSEquilibriumCannotBeMaintainedForever097: EventCard = {
  id: "OP13-097",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  traits: ["Celestial Dragons Five Elders"],
  effect:
    '[Main] You may rest 5 of your DON!! cards: If the only Characters on your field are "Celestial Dragons" type Characters, K.O. up to 1 of your opponent\'s Characters with a base cost of 6 or less.\n[Counter] Your Leader gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "trait",
                value: "Celestial Dragons",
                negate: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
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
  i18n: op13TheWorldSEquilibriumCannotBeMaintainedForever097I18n,
};
