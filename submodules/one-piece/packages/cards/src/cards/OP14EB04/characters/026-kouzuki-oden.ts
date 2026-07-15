import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KouzukiOden026I18n } from "./026-kouzuki-oden.i18n.ts";

export const op14eb04KouzukiOden026: CharacterCard = {
  id: "OP14-026",
  canonicalId: "OP14-026",
  slug: "kouzuki-oden/op14-026",
  name: "Kouzuki Oden",
  printings: [
    {
      id: "OP14-026",
      artId: "OP14-026",
      setCode: "OP14EB04",
      collectorNumber: "026",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-026_9ND0eW1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  effect: "[Opponent's Turn] If this Character is rested, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04KouzukiOden026I18n,
};
