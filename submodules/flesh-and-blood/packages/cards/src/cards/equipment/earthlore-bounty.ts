import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/earthlore-bounty.generated.ts";

/**
 * EVR020 Earthlore Bounty — Guardian Chest d2 Temper.
 *
 * Printed:
 *   Whenever you draw 1 or more cards from an action card effect, create that
 *   many Seismic Surge tokens.
 *   Temper
 *
 * Model notes (hand-authored):
 * - Draw trigger filter hasStatus from-action-card-effect is matched against
 *   the proposing layer source (Action type), not the drawn card — wired in
 *   trigger-matcher (EVR020).
 * - count event-amount is batch-summed for multi-draw (Valda family).
 * - End-phase draw-to-intellect is not an Action card effect (no surges).
 */
export const earthloreBounty = defineCard(fabCardIdentitiesByCanonicalId["qCwM6LGq87rrqGQFk8rKG"], {
  keywords: [temper],
  abilities: {
    wheneverDraw1MoreFromActionEffectCreateMany: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "draw",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "drawn-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "from-action-card-effect",
            },
          },
          amount: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
          // Batch-summed draw amount (same binding as drawn-this-way).
          count: {
            type: "event-amount",
          },
        },
      },
    },
  },
});
