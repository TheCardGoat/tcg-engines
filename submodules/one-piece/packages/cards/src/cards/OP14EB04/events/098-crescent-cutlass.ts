import type { EventCard } from "@tcg/op-types";
import { op14eb04CrescentCutlass098I18n } from "./098-crescent-cutlass.i18n.ts";

export const op14eb04CrescentCutlass098: EventCard = {
  id: "OP14-098",
  canonicalId: "OP14-098",
  slug: "crescent-cutlass/op14-098",
  name: "Crescent Cutlass",
  printings: [
    {
      id: "OP14-098",
      artId: "OP14-098",
      setCode: "OP14EB04",
      collectorNumber: "098",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-098_TiYroms.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Impel Down Former Baroque Works"],
  effect:
    '[Main] If there is a Character with a cost of 0 or with a cost of 8 or more, all of your Characters with a type including "Baroque Works" gain +3 cost until the end of your opponent\'s next End Phase. [Counter] Your Leader gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "existsOnField",
                player: "self",
                zone: "character",
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
              {
                condition: "existsOnField",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
              {
                condition: "existsOnField",
                player: "self",
                zone: "character",
                filters: [{ filter: "cost", comparison: "gte", value: 8 }],
              },
              {
                condition: "existsOnField",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "cost", comparison: "gte", value: 8 }],
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
            },
            value: 3,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
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
  i18n: op14eb04CrescentCutlass098I18n,
};
