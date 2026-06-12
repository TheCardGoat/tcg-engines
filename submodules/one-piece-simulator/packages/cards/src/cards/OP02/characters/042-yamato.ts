import type { CharacterCard } from "@tcg/op-types";
import { op02Yamato042I18n } from "./042-yamato.i18n.ts";

export const op02Yamato042: CharacterCard = {
  id: "OP02-042",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 6000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "Also treat this card's name as [Kouzuki Oden] according to the rules. [On Play] Rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02Yamato042I18n,
};
