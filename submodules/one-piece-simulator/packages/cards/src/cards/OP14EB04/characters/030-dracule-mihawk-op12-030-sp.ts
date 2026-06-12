import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DraculeMihawkOp12030Sp030I18n } from "./030-dracule-mihawk-op12-030-sp.i18n.ts";

export const op14eb04DraculeMihawkOp12030Sp030: CharacterCard = {
  id: "OP12-030",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 8,
  power: 8000,
  traits: ["The Seven Warlords of the Sea Muggy Kingdom"],
  attribute: "slash",
  effect:
    "[Blocker][On Play] Set up to 4 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 7 or more during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 4,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "baseCost",
                comparison: "gte",
                value: 7,
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04DraculeMihawkOp12030Sp030I18n,
};
