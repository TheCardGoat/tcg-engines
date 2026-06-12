import type { CharacterCard } from "@tcg/op-types";
import { op11MonkeyDLuffySp119I18n } from "./119-monkey-d-luffy-sp.i18n.ts";

export const op11MonkeyDLuffySp119: CharacterCard = {
  id: "OP05-119",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP11",
  cost: 10,
  power: 12000,
  traits: ["Straw Hat Crew The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p8.jpg",
      imageId: "OP05-119_p8",
    },
  ],
  effect:
    "[On Play] DON!! -10: Place all of your Characters except this Character at the bottom of your deck in any order. Then, take an extra turn after this one.\n[Activate:Main][Once Per Turn] (1): Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 10,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "__self__",
                },
              ],
              self: false,
            },
            position: "bottom",
          },
          {
            action: "extraTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11MonkeyDLuffySp119I18n,
};
