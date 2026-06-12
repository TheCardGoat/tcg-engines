import type { CharacterCard } from "@tcg/op-types";
import { op08TashigiSp006I18n } from "./006-tashigi-sp.i18n.ts";

export const op08TashigiSp006: CharacterCard = {
  id: "ST06-006",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may rest this Character: Give up to 1 of your opponent's Characters 2 cost during this turn.",
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
            value: 2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08TashigiSp006I18n,
};
