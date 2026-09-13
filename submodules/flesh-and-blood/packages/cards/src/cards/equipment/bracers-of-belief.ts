import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bracers-of-belief.generated.ts";

/**
 * ARC153 Bracers of Belief — Generic Arms d0.
 *
 * Printed:
 *   Action - Destroy Bracers of Belief: Reveal the top card of your deck. If
 *   you do, the next attack action card you play this turn, gains +X{p},
 *   where X is 3 minus the pitch value of the card revealed this way. Go again
 *
 * Model notes (hand-authored):
 * - reveal top + outputBinding it; then floating next AAC power grant.
 * - X = difference(3, pitch of it) — red +2, yellow +1, blue +0.
 * - reveal.then encodes "If you do" (no grant when reveal fails / empty deck).
 * - d0 seat — no battleworn/blade-break lifecycle to exercise.
 */
export const bracersOfBelief = defineCard(fabCardIdentitiesByCanonicalId["c9BtftttMG7WNrKgnfJFt"], {
  abilities: {
    actionDestroyBracersBeliefRevealTopDeckIfDo: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "if-you-do",
        effect: {
          type: "reveal",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: {
            type: "difference",
            operands: [
              3,
              {
                type: "reference",
                binding: "it",
                property: "pitch",
                missing: "zero",
              },
            ],
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  },
});
