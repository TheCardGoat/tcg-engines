import type { CharacterCard } from "@tcg/op-types";
import { op06Kikunojo104I18n } from "./104-kikunojo.i18n.ts";

export const op06Kikunojo104: CharacterCard = {
  id: "OP06-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 6000,
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[On K.O.] If your opponent has 3 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
        ],
      },
    ],
  },
  i18n: op06Kikunojo104I18n,
};
