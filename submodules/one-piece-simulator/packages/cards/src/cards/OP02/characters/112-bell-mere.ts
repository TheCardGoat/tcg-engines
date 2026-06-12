import type { CharacterCard } from "@tcg/op-types";
import { op02BellMere112I18n } from "./112-bell-mere.i18n.ts";

export const op02BellMere112: CharacterCard = {
  id: "OP02-112",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "ranged",
  effect:
    "[Activate:Main] You may rest this Character: Give up to 1 of your opponent's Characters -1 cost during this turn. Then, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            value: -1,
            duration: "thisTurn",
          },
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
        optional: true,
      },
    ],
  },
  i18n: op02BellMere112I18n,
};
