import type { CharacterCard } from "@tcg/op-types";
import { op01Hyogoro020I18n } from "./020-hyogoro.i18n.ts";

export const op01Hyogoro020: CharacterCard = {
  id: "OP01-020",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may rest this Character: Up to 1 of your Leader or Character cards gains +2000 power during this turn.  This card has been officially errata'd.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Hyogoro020I18n,
};
