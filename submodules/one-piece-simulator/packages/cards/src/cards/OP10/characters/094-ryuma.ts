import type { CharacterCard } from "@tcg/op-types";
import { op10Ryuma094I18n } from "./094-ryuma.i18n.ts";

export const op10Ryuma094: CharacterCard = {
  id: "OP10-094",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 4,
  power: 6000,
  traits: ["Land of Wano Thriller Bark Pirates"],
  attribute: "slash",
  effect: "[DON!! x1] This Character gains [Double Attack].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10Ryuma094I18n,
};
