import type { CharacterCard } from "@tcg/op-types";
import { op07OutlookIii003I18n } from "./003-outlook-iii.i18n.ts";

export const op07OutlookIii003: CharacterCard = {
  id: "OP07-003",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Goa Kingdom"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: Give up to 2 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07OutlookIii003I18n,
};
