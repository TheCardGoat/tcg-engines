import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteCustard103I18n } from "./103-charlotte-custard.i18n.ts";

export const op08CharlotteCustard103: CharacterCard = {
  id: "OP08-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] You may add 1 card from the top of your Life cards to your hand: Up to 1 of your Characters gains +1000 power until the end of your opponent's next turn.",
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
                upTo: true,
              },
            },
            value: 1000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08CharlotteCustard103I18n,
};
