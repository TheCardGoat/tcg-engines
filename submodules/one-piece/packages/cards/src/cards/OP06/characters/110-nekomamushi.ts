import type { CharacterCard } from "@tcg/op-types";
import { op06Nekomamushi110I18n } from "./110-nekomamushi.i18n.ts";

export const op06Nekomamushi110: CharacterCard = {
  id: "OP06-110",
  canonicalId: "OP06-110",
  slug: "nekomamushi/op06-110",
  name: "Nekomamushi",
  printings: [
    {
      id: "OP06-110",
      artId: "OP06-110",
      setCode: "OP06",
      collectorNumber: "110",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  effect: "[DON!! x2] This Character can also attack your opponent's active Characters.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06Nekomamushi110I18n,
};
