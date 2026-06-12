import type { CharacterCard } from "@tcg/op-types";
import { op10Koala047I18n } from "./047-koala.i18n.ts";

export const op10Koala047: CharacterCard = {
  id: "OP10-047",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    '[When Attacking] You may return 1 of your "Revolutionary Army" type Characters with a cost of 3 or more to the owner\'s hand: This Character gains +3000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Koala047I18n,
};
