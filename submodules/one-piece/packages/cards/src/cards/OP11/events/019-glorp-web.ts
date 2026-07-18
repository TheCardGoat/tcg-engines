import type { EventCard } from "@tcg/op-types";
import { op11GlorpWeb019I18n } from "./019-glorp-web.i18n.ts";

export const op11GlorpWeb019: EventCard = {
  id: "OP11-019",
  canonicalId: "OP11-019",
  slug: "glorp-web",
  name: "Glorp Web!!",
  printings: [
    {
      id: "OP11-019",
      artId: "OP11-019",
      setCode: "OP11",
      collectorNumber: "019",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-019.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Navy SWORD"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if your opponent has a Character with 6000 power or more, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 1000,
            duration: "thisTurn",
            condition: {
              condition: "existsOnField",
              player: "opponent",
              zone: "character",
              filters: [{ filter: "power", comparison: "gte", value: 6000 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11GlorpWeb019I18n,
};
