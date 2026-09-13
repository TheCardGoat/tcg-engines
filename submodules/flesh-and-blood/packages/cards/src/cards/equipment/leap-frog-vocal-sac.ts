import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/leap-frog-vocal-sac.generated.ts";

/**
 * HNT169 Leap Frog Vocal Sac — Assassin/Ninja Head d1 Blade Break.
 *
 * Printed: When an opponent plays or activates an attack reaction, you may
 * add this to the active chain link as a defending card. Blade Break
 *
 * Model notes (hand-authored):
 * - filter types:["Attack Reaction"] — AR is one CR type token, not the AND
 *   of types:["Attack","Reaction"] (would never match type-boxes).
 * - Dual play + activate triggers cover AR cards and AR equipment abilities.
 * - add-defending self from the Head seat (engine equipment-origin path).
 */
export const leapFrogVocalSac = defineCard(
  fabCardIdentitiesByCanonicalId["6Gqn7z8PhLkHtBnF7MmwJ"],
  {
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
  },
);
