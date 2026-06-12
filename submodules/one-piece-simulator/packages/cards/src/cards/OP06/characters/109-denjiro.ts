import type { CharacterCard } from "@tcg/op-types";
import { op06Denjiro109I18n } from "./109-denjiro.i18n.ts";

export const op06Denjiro109: CharacterCard = {
  id: "OP06-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x2] If your opponent has 3 or less Life cards, this Character cannot be K.O.'d by effects.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
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
  i18n: op06Denjiro109I18n,
};
