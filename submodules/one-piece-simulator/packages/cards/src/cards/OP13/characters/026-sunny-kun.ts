import type { CharacterCard } from "@tcg/op-types";
import { op13SunnyKun026I18n } from "./026-sunny-kun.i18n.ts";

export const op13SunnyKun026: CharacterCard = {
  id: "OP13-026",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] [Once Per Turn] You may rest 1 of your DON!! cards: This Character gains +2000 power until the end of your opponent's next turn.",
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
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13SunnyKun026I18n,
};
