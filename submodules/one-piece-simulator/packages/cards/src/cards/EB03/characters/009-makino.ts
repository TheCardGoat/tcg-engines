import type { CharacterCard } from "@tcg/op-types";
import { eb03Makino009I18n } from "./009-makino.i18n.ts";

export const eb03Makino009: CharacterCard = {
  id: "EB03-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["2000"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your Characters with no base effect gains +2000 power during this turn.",
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
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "noBaseEffect",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Makino009I18n,
};
