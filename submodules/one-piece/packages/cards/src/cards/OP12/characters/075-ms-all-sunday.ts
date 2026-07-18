import type { CharacterCard } from "@tcg/op-types";
import { op12MsAllSunday075I18n } from "./075-ms-all-sunday.i18n.ts";

export const op12MsAllSunday075: CharacterCard = {
  id: "OP12-075",
  canonicalId: "OP12-075",
  slug: "ms-all-sunday/op12-075",
  name: "Ms. All Sunday",
  printings: [
    {
      id: "OP12-075",
      artId: "OP12-075",
      setCode: "OP12",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-075_de0O1c3.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "DON!! 1: Play this card.",
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 3 or less. Then, your opponent may add 1 DON!! card from their DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
          {
            action: "addDon",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op12MsAllSunday075I18n,
};
