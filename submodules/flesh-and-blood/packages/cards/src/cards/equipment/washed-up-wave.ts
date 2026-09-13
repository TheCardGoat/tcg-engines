import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/washed-up-wave.generated.ts";

/**
 * AGB006 Washed Up Wave — Pirate Necromancer Arms d0 Blade Break.
 *
 * Printed:
 *   When this defends, you may discard a card or destroy the top card of your
 *   deck. If that card has watery grave, this gets +2{d}.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - "this defends" → subject:self (co-defenders must not fire).
 * - Both choice arms stamp outputBinding "it" so "if that card has watery
 *   grave" can binding-matches (prior model never bound the discarded/destroyed
 *   card → +2{d} never applied).
 */
export const washedUpWave = defineCard(fabCardIdentitiesByCanonicalId["QtHWQMww79tzzPLJfbQBp"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayDiscardDestroyTopDeckIfHas: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "choice",
                options: [
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                    // "that card" for watery-grave check.
                    outputBinding: "it",
                  },
                  {
                    type: "destroy",
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
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  hasKeyword: "watery-grave",
                },
              },
              then: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  },
});
