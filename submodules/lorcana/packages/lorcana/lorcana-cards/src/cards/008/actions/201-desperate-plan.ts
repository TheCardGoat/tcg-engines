import type { ActionCard } from "@tcg/lorcana-types";
import { desperatePlanI18n } from "./201-desperate-plan.i18n";

export const desperatePlan: ActionCard = {
  id: "uXE",
  canonicalId: "ci_sk9",
  reprints: ["set8-201"],
  cardType: "action",
  name: "Desperate Plan",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  cardNumber: 201,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_cfbcf752b5064d1e8abfc2a2c6d3e98a",
    tcgPlayer: 631990,
  },
  text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "resource-count",
          controller: "you",
          what: "cards-in-hand",
          comparison: "equal",
          value: 0,
        },
        then: {
          type: "draw-until-hand-size",
          size: 3,
          target: "CONTROLLER",
        },
        else: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              target: "CONTROLLER",
              from: "hand",
              chosen: true,
              amount: "DISCARDED_COUNT",
            },
            {
              type: "draw",
              amount: "DISCARDED_COUNT",
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: desperatePlanI18n,
};
