import type { CharacterCard } from "@tcg/op-types";
import { op11Streusen074I18n } from "./074-streusen.i18n.ts";

export const op11Streusen074: CharacterCard = {
  id: "OP11-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! 1, You may rest this Character: Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Streusen074I18n,
};
