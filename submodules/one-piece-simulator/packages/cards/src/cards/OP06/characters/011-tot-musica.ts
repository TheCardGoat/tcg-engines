import type { CharacterCard } from "@tcg/op-types";
import { op06TotMusica011I18n } from "./011-tot-musica.i18n.ts";

export const op06TotMusica011: CharacterCard = {
  id: "OP06-011",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "special",
  effect:
    "[Activate:Main] [Once Per Turn] You may rest 1 of your [Uta] cards: This Character gains +5000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 5000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06TotMusica011I18n,
};
