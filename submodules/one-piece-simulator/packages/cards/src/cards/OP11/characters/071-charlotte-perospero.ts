import type { CharacterCard } from "@tcg/op-types";
import { op11CharlottePerospero071I18n } from "./071-charlotte-perospero.i18n.ts";

export const op11CharlottePerospero071: CharacterCard = {
  id: "OP11-071",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP11",
  cost: 5,
  power: 7000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, draw 1 card and add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11CharlottePerospero071I18n,
};
