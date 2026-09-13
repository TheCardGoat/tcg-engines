import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heart-of-vengeance.generated.ts";

/**
 * HNT145 Heart of Vengeance — Draconic Chest d1 Blade Break.
 *
 * Printed:
 *   Instant - Destroy this: Your next attack this turn that targets Arakni
 *   costs {r} less to play or activate.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - "play or activate" covers Attack action cards and Weapon attacks.
 * - hasStatus targets-arakni is matched on the defending/prospective hero
 *   moniker (wired in matches-filter; 1v1 sole-opponent default for quote).
 * - Instant destroy-self → continuous cost −1 this-turn appliesTo.next.
 */
export const heartOfVengeance = defineCard(
  fabCardIdentitiesByCanonicalId["CkRKLHpzHJLkmDdBFJCwM"],
  {
    keywords: [bladeBreak],
    abilities: {
      instantDestroyNextAttackTurnTargetsArakniCostsLess: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              // AAC (Attack subtype) or Weapon activate — "play or activate".
              or: [
                {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
                {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
              ],
              hasStatus: "targets-arakni",
            },
          },
        },
      },
    },
  },
);
