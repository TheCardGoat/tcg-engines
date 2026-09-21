import type { CharacterCard } from "@tcg/op-types";
import { op16DocQ109I18n } from "./op16-109-doc-q.i18n.ts";

export const op16DocQ109: CharacterCard = {
  id: "OP16-109",
  canonicalId: "OP16-109",
  slug: "doc-q/op16-109",
  name: "Doc Q",
  printings: [
    {
      id: "OP16-109",
      artId: "OP16-109",
      setCode: "OP16",
      collectorNumber: "109",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-109_thoYpS1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 0,
  counter: 2000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  effect:
    "[On K.O.] If your Leader has the {Blackbeard Pirates} type, draw 1 card and K.O. up to 2 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16DocQ109I18n,
};
