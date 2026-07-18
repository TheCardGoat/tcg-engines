import type { StageCard } from "@tcg/op-types";
import { op02LandOfWano048I18n } from "./048-land-of-wano.i18n.ts";

export const op02LandOfWano048: StageCard = {
  id: "OP02-048",
  canonicalId: "OP02-048",
  slug: "land-of-wano",
  name: "Land of Wano",
  printings: [
    {
      id: "OP02-048",
      artId: "OP02-048",
      setCode: "OP02",
      collectorNumber: "048",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-048.jpg",
    },
  ],
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
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Land of Wano",
                match: "includes",
              },
            ],
          },
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
