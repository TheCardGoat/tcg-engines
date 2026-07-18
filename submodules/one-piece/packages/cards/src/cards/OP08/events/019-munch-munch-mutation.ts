import type { EventCard } from "@tcg/op-types";
import { op08MunchMunchMutation019I18n } from "./019-munch-munch-mutation.i18n.ts";

export const op08MunchMunchMutation019: EventCard = {
  id: "OP08-019",
  canonicalId: "OP08-019",
  slug: "munch-munch-mutation",
  name: "Munch-Munch Mutation",
  printings: [
    {
      id: "OP08-019",
      artId: "OP08-019",
      setCode: "OP08",
      collectorNumber: "019",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-019.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  traits: ["Drum Kingdom"],
  effect:
    "[Main]/[Counter] Give up to 1 of your opponent's Characters −3000 power during this turn. Then, up to 1 of your Characters gains +3000 power during this turn. [Trigger] K.O. up to 1 of your opponent's Characters with 5000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  filter: "power",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08MunchMunchMutation019I18n,
};
