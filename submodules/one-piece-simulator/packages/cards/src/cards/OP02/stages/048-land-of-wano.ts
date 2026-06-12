import type { StageCard } from "@tcg/op-types";
import { op02LandOfWano048I18n } from "./048-land-of-wano.i18n.ts";

export const op02LandOfWano048: StageCard = {
  id: "OP02-048",
  cardType: "stage",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["Land of Wano"],
  effect:
    "[Activate:Main] You may trash 1 [Land of Wano] type card from your hand and rest this Stage: Set up to 1 of your DON!! cards as active.",
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
  i18n: op02LandOfWano048I18n,
};
