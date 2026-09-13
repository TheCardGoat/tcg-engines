import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skull-crushers.generated.ts";

/**
 * EVR001 Skull Crushers — Brute Arms d1 Battleworn.
 *
 * Printed:
 *   Whenever you roll a 5 or 6 on a die, your Brute attacks gain +1{p} this turn.
 *   Whenever you roll a 1 on a die, destroy Skull Crushers.
 *   Battleworn
 *
 * Model notes (hand-authored; case-by-case):
 * - Prior model used event name "trigger" + hasStatus "rolled-N-on-a-die".
 *   Live die resolution emits committed `roll` with data.result — the status
 *   residue never matched (same class as Gambler's Gloves clash mis-model).
 * - Triggers: name "roll" + actor controller + comparison on the face
 *   (gte 5 for 5–6; eq 1 for self-destroy). eventAmount on roll → result.
 * - +1{p} is a floating this-turn aura for all Brute attacks (appliesTo.next
 *   supertypes Brute + count star), not combat-chain-at-resolution only
 *   (gallantry-gold / stubby-hammerers pattern).
 */
export const skullCrushers = defineCard(fabCardIdentitiesByCanonicalId["KccqWCmJhTfHpcNQJfdMQ"], {
  keywords: [battleworn],
  abilities: {
    wheneverRoll56DieBruteAttacksGain1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "roll",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          result: {
            op: "gte",
            value: 5,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                supertypes: ["Brute"],
              },
            },
            count: { type: "all" },
          },
        },
      },
    },
    wheneverRoll1DieDestroySkullCrushers: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "roll",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          result: {
            op: "eq",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
