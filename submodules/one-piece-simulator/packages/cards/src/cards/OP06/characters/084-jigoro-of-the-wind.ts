import type { CharacterCard } from "@tcg/op-types";
import { op06JigoroOfTheWind084I18n } from "./084-jigoro-of-the-wind.i18n.ts";

export const op06JigoroOfTheWind084: CharacterCard = {
  id: "OP06-084",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect: "[On K.O.] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06JigoroOfTheWind084I18n,
};
