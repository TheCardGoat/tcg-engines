import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hand-of-vengeance.generated.ts";

/**
 * HNT146 Hand of Vengeance — Draconic Arms d1 Blade Break.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target attack that is attacking Arakni
 *   gets +1{p}.
 *   Blade Break
 *
 * Model notes (hand-authored; case-by-case):
 * - Prior filter was parser residue: and:[subtypes Attack/That/Is/Attacking/
 *   Arakni] — never matches.
 * - Remodel: on-stack combat-chain target with hasStatus:"targets-arakni"
 *   (same moniker path as HNT145 Heart of Vengeance / matches-filter).
 * - AR destroy-self; duration this-combat-chain for the active attack's {p}.
 * - In 1v1 the attacking player seats the arms and uses the AR on their attack.
 */
export const handOfVengeance = defineCard(fabCardIdentitiesByCanonicalId["8qzF9KbHtkNHpGzpdGWhk"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionDestroyTargetAttackIsAttackingArakniGets: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            hasStatus: "targets-arakni",
          },
          count: 1,
        },
        duration: "this-combat-chain",
        outputBinding: "it",
      },
    },
  },
});
