import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/diamond-hands.generated.ts";

/**
 * LSS008 Diamond Hands — Merchant Arms d1 Blade Break (Ruu'di Specialization).
 *
 * Printed:
 *   Ruu'di Specialization
 *   At the beginning of your end phase, if you have 4 or more cards in hand,
 *   create a Diamond token.
 *   Blade Break
 *
 * Model notes (hand-authored; case-by-case; frontline end-phase family):
 * - "Your end phase" needs actor:controller — bare end-phase matches every
 *   seat's end phase (including the opponent's).
 * - zone-count hand gte 4 on controller is the printed hand gate.
 * - create-token diamond under controller (FAB165).
 * - specialization is meta (registration only); bladeBreak on defend.
 */
export const diamondHands = defineCard(fabCardIdentitiesByCanonicalId["7wcw6w9b7dwfdQwf67MmK"], {
  keywords: [
    {
      name: "specialization",
      hero: "Ruu'di",
    },
    bladeBreak,
  ],
  abilities: {
    atBeginningEndPhaseIfHave4MoreHand: {
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
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "gte",
            value: 4,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "diamond",
          controller: "controller",
        },
      },
    },
  },
});
