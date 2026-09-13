import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/eloquent-eulogy.generated.ts";

import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const eloquentEulogy = definePitchFamily(fabPitchFamilies["eloquent-eulogy"], {
  keywords: [runeGate, bloodDebt],
  abilities: () => ({
    whenCombatChainClosesIfHeroHasLostTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "combat-chain-close",
          actor: {
            kind: "none",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "heroes-lost-life-this-turn" },
          comparison: { op: "gte", value: 1 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "eloquence",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: eloquentEulogyRed } = eloquentEulogy.cards;
