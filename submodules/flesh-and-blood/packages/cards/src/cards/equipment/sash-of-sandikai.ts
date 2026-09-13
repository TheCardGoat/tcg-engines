import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sash-of-sandikai.generated.ts";

/**
 * FAI004 Sash of Sandikai — Draconic Chest d0.
 *
 * Printed:
 *   Instant - Destroy Sash of Sandikai: Gain {r}. Activate this ability only if
 *   you've played a red card this turn.
 *
 * Model notes (hand-authored):
 * - "red card" is a color filter, not a type-line token. Prior types:["Red"]
 *   is invalid vocabulary for matchesFilter (assertTypeLineValue throws) and
 *   never matched pitch/play color. Dromai sibling uses color:["red"].
 * - Instant destroy-self: no AP; equipment goes to GY as cost.
 * - d0 has no temper/bladeBreak lifecycle.
 */
export const sashOfSandikai = defineCard(fabCardIdentitiesByCanonicalId["9BqdPQckmdgcfzwtjw7BP"], {
  abilities: {
    instantDestroySashSandikaiGainActivateAbilityOnlyIf: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          // Color, not type — Red is FabColor after normalize, not FAB_TYPES.
          color: ["red"],
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
