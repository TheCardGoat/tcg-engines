import type { CharacterCard } from "@tcg/op-types";
import { op01Sasaki101I18n } from "./101-sasaki.i18n.ts";

export const op01Sasaki101: CharacterCard = {
  id: "OP01-101",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and rest it.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Sasaki101I18n,
};
