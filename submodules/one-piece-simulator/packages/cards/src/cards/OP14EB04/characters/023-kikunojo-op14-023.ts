import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KikunojoOp14023023I18n } from "./023-kikunojo-op14-023.i18n.ts";

export const op14eb04KikunojoOp14023023: CharacterCard = {
  id: "OP14-023",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect: "[End of Your Turn] Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04KikunojoOp14023023I18n,
};
