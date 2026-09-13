import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silver-palms.generated.ts";

/**
 * EVR086 Silver Palms — Merchant Arms d2 Blade Break.
 *
 * Printed:
 *   At the start of each other hero's turn, if they have less {h} than you,
 *   they may draw a card. If they do, you create a Silver token.
 *   Blade Break
 *
 * Model notes (hand-authored; case-by-case):
 * - start-phase actor:opponent + life-comparison self > opponent gates the
 *   "if they have less {h} than you" clause.
 * - Prior model: optional draw player:"attack-target" with no chooser —
 *   dead outside combat (no attack-target seat); chooser defaulted to
 *   controller so the arms controller answered "they may draw".
 * - Remodel: chooser:"opponent" + draw player:"opponent"; then create silver
 *   under controller (if-you-do).
 */
export const silverPalms = defineCard(fabCardIdentitiesByCanonicalId["gCgcRpmr76G6zmFgpprRw"], {
  keywords: [bladeBreak],
  abilities: {
    atStartEachOtherHeroSTurnIfThey: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "gt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          // "they may" — the other hero answers, not the equipment controller.
          chooser: "opponent",
          effect: {
            type: "draw",
            count: 1,
            player: "opponent",
          },
          then: {
            type: "create-token",
            token: "silver",
            controller: "controller",
          },
        },
      },
    },
  },
});
