import type { CharacterCard } from "@tcg/op-types";
import { op10KouzukiMomonosuke083I18n } from "./083-kouzuki-momonosuke.i18n.ts";

export const op10KouzukiMomonosuke083: CharacterCard = {
  id: "OP10-083",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano Kouzuki Clan Dressrosa"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: Give up to 1 of your opponent\'s Characters -2 cost during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10KouzukiMomonosuke083I18n,
};
