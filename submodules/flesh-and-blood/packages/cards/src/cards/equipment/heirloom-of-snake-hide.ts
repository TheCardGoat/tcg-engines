import { battleworn, cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heirloom-of-snake-hide.generated.ts";

/**
 * MST005 Heirloom of Snake Hide — Mystic Assassin Chest d2.
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, at the start of your turn, if you have
 *   exactly 1{h}, you may turn this face-up.
 *   Battleworn
 *
 * Model notes (hand-authored; rabbit-hide / tiger-hide family):
 * - Cloaked seats face-down.
 * - start-phase + equipped-face-down + life eq 1 → optional turn-face-up.
 * - Battleworn independent when face-up and defending.
 */
export const heirloomOfSnakeHide = defineCard(
  fabCardIdentitiesByCanonicalId["wqzWn8rMcWhGwNQfKtWtG"],
  {
    keywords: [cloaked, battleworn],
    abilities: {
      atStartTurnIfHaveExactly1MayTurn: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "and",
            conditions: [
              {
                type: "has-status",
                status: "equipped-face-down",
              },
              {
                type: "life-comparison",
                player: "self",
                vs: "fixed",
                op: "eq",
                value: 1,
              },
            ],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "turn-face-up",
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
