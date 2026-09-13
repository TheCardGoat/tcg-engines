import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/leap-frog-gloves.generated.ts";

/**
 * HNT171 Leap Frog Gloves — Assassin/Ninja Arms d1 Blade Break.
 *
 * Printed:
 *   When an opponent plays or activates an attack reaction, you may add this
 *   to the active chain link as a defending card.
 *   Blade Break
 *
 * Model notes (hand-authored; arms twin of HNT169 vocal-sac / ARK004 slime-skin):
 * - filter types:["Attack Reaction"] — AR is one CR type token, not the AND
 *   of types:["Attack","Reaction"] (never matches type-boxes).
 * - Dual play + activate triggers cover AR cards and AR equipment abilities.
 * - optional add-defending self from Arms seat.
 */
export const leapFrogGloves = defineCard(fabCardIdentitiesByCanonicalId["RBnkrB6LWQHFDcD8RjcWT"], {
  keywords: [bladeBreak],
  abilities: {
    whenOpponentPlaysActivatesAttackReactionMayAddActive: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Attack Reaction"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "add-defending",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    whenOpponentPlaysActivatesAttackReactionMayAddActive2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Attack Reaction"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "add-defending",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
});
