import type { StageCard } from "@tcg/op-types";
import { op08Zou039I18n } from "./039-zou.i18n.ts";

export const op08Zou039: StageCard = {
  id: "OP08-039",
  cardType: "stage",
  color: ["green"],
  rarity: "R",
  setId: "OP08",
  cost: 3,
  traits: ["Animal"],
  effect:
    "[Activate:Main] You may rest this Stage: If your Leader has the [Minks] type, set up to 1 of your DON!! cards as active. [End of Your Turn] Set up to 1 of your [Minks] type Characters as active.",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Zou039I18n,
};
