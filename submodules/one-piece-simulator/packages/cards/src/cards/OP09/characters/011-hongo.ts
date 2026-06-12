import type { CharacterCard } from "@tcg/op-types";
import { op09Hongo011I18n } from "./011-hongo.i18n.ts";

export const op09Hongo011: CharacterCard = {
  id: "OP09-011",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "strike",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Red-Haired Pirates" type, give up to 1 of your opponent\'s Characters 2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Red-Haired Pirates",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
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
  i18n: op09Hongo011I18n,
};
