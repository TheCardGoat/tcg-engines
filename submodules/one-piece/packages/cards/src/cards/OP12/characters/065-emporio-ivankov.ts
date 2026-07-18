import type { CharacterCard } from "@tcg/op-types";
import { op12EmporioIvankov065I18n } from "./065-emporio-ivankov.i18n.ts";

export const op12EmporioIvankov065: CharacterCard = {
  id: "OP12-065",
  canonicalId: "OP12-065",
  slug: "emporio-ivankov/op12-065",
  name: "Emporio.Ivankov",
  printings: [
    {
      id: "OP12-065",
      artId: "OP12-065",
      setCode: "OP12",
      collectorNumber: "065",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-065_U89BQiQ.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "special",
  effect:
    "If you have 4 or more Events in your trash, this Character gains [Blocker].\n[On K.O.] Add up to 1 Event from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12EmporioIvankov065I18n,
};
