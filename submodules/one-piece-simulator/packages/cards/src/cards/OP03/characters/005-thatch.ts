import type { CharacterCard } from "@tcg/op-types";
import { op03Thatch005I18n } from "./005-thatch.i18n.ts";

export const op03Thatch005: CharacterCard = {
  id: "OP03-005",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] This Character gains +2000 power during this turn. Then, trash this Character at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "trashThisCard",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op03Thatch005I18n,
};
