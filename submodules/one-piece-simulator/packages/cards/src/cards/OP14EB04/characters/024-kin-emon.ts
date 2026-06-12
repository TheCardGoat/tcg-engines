import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KinEmon024I18n } from "./024-kin-emon.i18n.ts";

export const op14eb04KinEmon024: CharacterCard = {
  id: "OP14-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[On Play] Set up to 3 of your DON!! cards as active. Then, you cannot play Character cards during this turn.\n[On K.O.] Rest up to 1 of your opponent's cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 3,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04KinEmon024I18n,
};
