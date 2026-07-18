import type { EventCard } from "@tcg/op-types";
import { op14eb04TimeForTheCounterattack018I18n } from "./018-time-for-the-counterattack.i18n.ts";

export const op14eb04TimeForTheCounterattack018: EventCard = {
  id: "OP14-018",
  canonicalId: "OP14-018",
  slug: "time-for-the-counterattack",
  name: "Time for the Counterattack",
  printings: [
    {
      id: "OP14-018",
      artId: "OP14-018",
      setCode: "OP14EB04",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-018_DRa50Ji.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Play up to 1 red Character card with 2000 power or less from your hand.",
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  effect:
    "[Counter] If there is a Character with 8000 power or more, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "existsOnField",
                player: "self",
                zone: "character",
                filters: [{ filter: "power", comparison: "gte", value: 8000 }],
              },
              {
                condition: "existsOnField",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "power", comparison: "gte", value: 8000 }],
              },
            ],
          },
        ],
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
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cardCategory", value: "character" },
              { filter: "color", value: "red" },
              { filter: "power", comparison: "lte", value: 2000 },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04TimeForTheCounterattack018I18n,
};
