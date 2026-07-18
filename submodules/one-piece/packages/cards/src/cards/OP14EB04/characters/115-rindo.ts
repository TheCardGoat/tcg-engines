import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Rindo115I18n } from "./115-rindo.i18n.ts";

export const op14eb04Rindo115: CharacterCard = {
  id: "OP14-115",
  canonicalId: "OP14-115",
  slug: "rindo/op14-115",
  name: "Rindo",
  printings: [
    {
      id: "OP14-115",
      artId: "OP14-115",
      setCode: "OP14EB04",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-115_xeIERPN.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 5000,
  counter: 1000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Kuja Pirates"],
  attribute: "ranged",
  effect:
    "[Opponent's Turn] [On K.O.] Add up to 1 card from the top of your deck to the top of your Life cards. Then, you take 1 damage.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "dealDamage",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Kuja Pirates",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Rindo115I18n,
};
