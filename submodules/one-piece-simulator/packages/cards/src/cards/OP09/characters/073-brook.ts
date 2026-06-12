import type { CharacterCard } from "@tcg/op-types";
import { op09Brook073I18n } from "./073-brook.i18n.ts";

export const op09Brook073: CharacterCard = {
  id: "OP09-073",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[When Attacking] You may return 1 or more DON!! cards from your field to your DON!! deck: Give up to 2 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Brook073I18n,
};
