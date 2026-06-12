import type { CharacterCard } from "@tcg/op-types";
import { op12Inuarashi022I18n } from "./022-inuarashi.i18n.ts";

export const op12Inuarashi022: CharacterCard = {
  id: "OP12-022",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your opponent's rested Characters with a cost of 5 or less will not become active in your opponent's next Refresh Phase.",
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
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Inuarashi022I18n,
};
