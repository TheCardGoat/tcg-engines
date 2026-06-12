import type { CharacterCard } from "@tcg/op-types";
import { op08Milky032I18n } from "./032-milky.i18n.ts";

export const op08Milky032: CharacterCard = {
  id: "OP08-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP08",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Minks"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may rest this Character: If your Leader has the [Minks] type, set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Minks",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Milky032I18n,
};
