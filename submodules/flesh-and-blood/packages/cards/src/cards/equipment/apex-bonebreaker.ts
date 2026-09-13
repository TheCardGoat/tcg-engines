import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/apex-bonebreaker.generated.ts";

/**
 * HVY008 Apex Bonebreaker — Brute Arms d2 Temper.
 *
 * Printed:
 *   When this defends together with a card with 6 or more {p}, create a Might
 *   token.
 *   Temper
 *
 * Model notes (hand-authored; case-by-case; AJV005 tectonic-crust sibling):
 * - "When this defends together with …" requires subject:self so co-defender
 *   defend events do not match (double-fire / false partner paths).
 * - togetherWith power gte 6 matches partner printed/evaluated {p}.
 * - create-token might under controller; Temper first defend −1{d}.
 */
export const apexBonebreaker = defineCard(fabCardIdentitiesByCanonicalId["QTpCnrrjTbQhdRdLBzLzB"], {
  keywords: [temper],
  abilities: {
    whenDefendsTogether6MoreCreateMightToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with",
            filter: {
              power: {
                op: "gte",
                value: 6,
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
        },
      },
    },
  },
});
