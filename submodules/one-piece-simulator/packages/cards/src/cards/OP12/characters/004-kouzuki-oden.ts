import type { CharacterCard } from "@tcg/op-types";
import { op12KouzukiOden004I18n } from "./004-kouzuki-oden.i18n.ts";

export const op12KouzukiOden004: CharacterCard = {
  id: "OP12-004",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan Roger Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] You may reveal 2 Events from your hand: This Character gains +2000 power during this turn.",
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
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12KouzukiOden004I18n,
};
