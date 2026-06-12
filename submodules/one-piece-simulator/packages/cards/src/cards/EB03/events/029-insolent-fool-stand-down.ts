import type { EventCard } from "@tcg/op-types";
import { eb03InsolentFoolStandDown029I18n } from "./029-insolent-fool-stand-down.i18n.ts";

export const eb03InsolentFoolStandDown029: EventCard = {
  id: "EB03-029",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] You may rest 4 of your DON!! cards: If your Leader is [Boa Hancock], play up to 1 {Amazon Lily} or {Kuja Pirates} type Character card with a cost of 6 or less from your hand. [Counter] Up to 1 of your [Boa Hancock] cards gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Boa Hancock",
          },
        ],
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
                value: 6,
              },
              {
                filter: "trait",
                value: "Amazon Lily",
              },
              {
                filter: "trait",
                value: "Kuja Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
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
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Boa Hancock",
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
  i18n: eb03InsolentFoolStandDown029I18n,
};
