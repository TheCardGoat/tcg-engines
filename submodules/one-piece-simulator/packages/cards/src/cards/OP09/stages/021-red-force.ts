import type { StageCard } from "@tcg/op-types";
import { op09RedForce021I18n } from "./021-red-force.i18n.ts";

export const op09RedForce021: StageCard = {
  id: "OP09-021",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  traits: ["Red-Haired Pirates"],
  effect:
    '[Activate: Main] You may rest this Stage: If your Leader has the "Red-Haired Pirates" type, give up to 1 of your opponent\'s Characters 1000 power during this turn.',
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09RedForce021I18n,
};
