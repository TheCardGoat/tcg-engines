import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kassai-cintari-sellsword.generated.ts";

export const kassaiCintariSellsword = defineCard(
  fabCardIdentitiesByCanonicalId["wWmP8RJRq7MWk7kBh9q7w"],
  {
    abilities: {
      secondSwordAttackTurnCostsResourceLess: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-activation-cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            events: ["activate"],
            ordinal: 2,
            // Printed "each turn" — re-arm the ordinal quota every turn boundary.
            perTurn: true,
          },
        },
      },
      beginningEndPhaseAttacked2MoreTimesWeaponsTurnCreateCopperTokenWeaponAttackHit: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "end-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "compare-amount",
            amount: { type: "count", what: "weapon-attacks-this-turn" },
            comparison: { op: "gte", value: 2 },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "copper",
            controller: "controller",
            count: {
              type: "count",
              what: "weapon-attacks-that-hit-this-turn",
            },
          },
        },
      },
    },
  },
);
