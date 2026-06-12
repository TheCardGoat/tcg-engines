import type { CharacterCard } from "@tcg/op-types";
import { op04Usopp003I18n } from "./003-usopp.i18n.ts";

export const op04Usopp003: CharacterCard = {
  id: "OP04-003",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "wisdom",
  effect: "[On K.O.] K.O. up to 1 of your opponent's Characters with 5000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Usopp003I18n,
};
