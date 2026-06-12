import type { CharacterCard } from "@tcg/op-types";
import { op05MonkeyDLuffy119I18n } from "./119-monkey-d-luffy.i18n.ts";

export const op05MonkeyDLuffy119: CharacterCard = {
  id: "OP05-119",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP05",
  cost: 10,
  power: 12000,
  traits: ["Straw Hat Crew The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p1.jpg",
      imageId: "OP05-119_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p2.jpg",
      imageId: "OP05-119_p2",
    },
  ],
  effect:
    "[On Play] DON!! -10: Place all of your Characters except this Character at the bottom of your deck in any order. Then, take an extra turn after this one. [Activate:Main][Once Per Turn] (1): Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
  i18n: op05MonkeyDLuffy119I18n,
};
