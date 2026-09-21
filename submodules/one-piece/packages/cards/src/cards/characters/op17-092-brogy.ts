import type { CharacterCard } from "@tcg/op-types";
import { op17Brogy092I18n } from "./op17-092-brogy.i18n.ts";

export const op17Brogy092: CharacterCard = {
  id: "OP17-092",
  canonicalId: "OP17-092",
  slug: "brogy/op17-092",
  name: "Brogy",
  printings: [
    {
      id: "OP17-092",
      artId: "OP17-092",
      setCode: "OP17",
      collectorNumber: "092",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-092.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP17",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Giant Elbaph Giant Pirates"],
  attribute: "slash",
  effect:
    "This Character gains +12 cost. [On Play] If your Leader has the {Elbaph} type, play up to 1 [Dorry] with a cost of 5 or less from your hand or trash. Then, you cannot play Character cards during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Elbaph",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "name",
                value: "Dorry",
              },
            ],
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
  },
  i18n: op17Brogy092I18n,
};
