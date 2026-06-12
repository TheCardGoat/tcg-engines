import type { CharacterCard } from "@tcg/op-types";
import { op04Tonoyasu109I18n } from "./109-tonoyasu.i18n.ts";

export const op04Tonoyasu109: CharacterCard = {
  id: "OP04-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: Up to 1 of your [Land of Wano] type Leader or Character cards gains +3000 power during this turn.",
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
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Tonoyasu109I18n,
};
