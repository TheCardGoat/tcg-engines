import type { CharacterCard } from "@tcg/op-types";
import { op16VanAugur103I18n } from "./op16-103-van-augur.i18n.ts";

export const op16VanAugur103: CharacterCard = {
  id: "OP16-103",
  canonicalId: "OP16-103",
  slug: "van-augur/op16-103",
  name: "Van Augur",
  printings: [
    {
      id: "OP16-103",
      artId: "OP16-103",
      setCode: "OP16",
      collectorNumber: "103",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-103_o1kroCA.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Blackbeard Pirates"],
  attribute: "ranged",
  effect:
    "[Opponent's Turn] [On K.O.] If your Leader has the {Blackbeard Pirates} type, draw 1 card and give up to 1 of your opponent's Leader or Character cards -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16VanAugur103I18n,
};
