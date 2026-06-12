import type { CharacterCard } from "@tcg/op-types";
import { op02ByrnndiWorld082I18n } from "./082-byrnndi-world.i18n.ts";

export const op02ByrnndiWorld082: CharacterCard = {
  id: "OP02-082",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 8,
  power: 8000,
  traits: ["World Pirates"],
  attribute: "strike",
  effect:
    "[Activate:Main] DON!! -8 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains +792000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 8,
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
            value: 792000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02ByrnndiWorld082I18n,
};
