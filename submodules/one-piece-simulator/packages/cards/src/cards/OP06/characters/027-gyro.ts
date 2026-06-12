import type { CharacterCard } from "@tcg/op-types";
import { op06Gyro027I18n } from "./027-gyro.i18n.ts";

export const op06Gyro027: CharacterCard = {
  id: "OP06-027",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Gyro Pirates"],
  attribute: "slash",
  effect: "[On K.O.] Rest up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op06Gyro027I18n,
};
