import type { CharacterCard } from "@tcg/op-types";
import { op02Borsalino114I18n } from "./114-borsalino.i18n.ts";

export const op02Borsalino114: CharacterCard = {
  id: "OP02-114",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-114_p1.jpg",
      imageId: "OP02-114_p1",
    },
  ],
  effect:
    "[Opponent's Turn] This Character gains +1000 power and cannot be K.O.'d by effects. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
            value: 1000,
            duration: "permanent",
          },
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
          },
        ],
      },
    ],
  },
  i18n: op02Borsalino114I18n,
};
