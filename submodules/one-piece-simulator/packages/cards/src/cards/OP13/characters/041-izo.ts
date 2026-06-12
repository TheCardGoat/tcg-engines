import type { CharacterCard } from "@tcg/op-types";
import { op13Izo041I18n } from "./041-izo.i18n.ts";

export const op13Izo041: CharacterCard = {
  id: "OP13-041",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  effect: "[On Play] Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op13Izo041I18n,
};
