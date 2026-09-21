import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/concealed-pathogen.generated.ts";

/**
 * PEN080 Concealed Pathogen — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack hits you and its
 *   controller has played or activated an attack reaction this chain link,
 *   destroy this and create a Bloodrot Pox token under each opponent's control.
 *
 * Model notes (hand-authored; sibling of PEN079):
 * - Gate face-down + AR-this-chain-link fact (Red Alert family status id).
 *   Prior status name was unwired residue → always false.
 * - Hit: opponent attack hits hero ("hits you"); no subtypes:Attack residue
 *   (Attack is type-line, not subtype-only).
 * - create-token controller:opponent (was each — seats under trap owner too).
 */
export const concealedPathogen = defineCard(
  fabCardIdentitiesByCanonicalId["mWbfgWG7j8CdTtKHfJgJr"],
  {
    keywords: [cloaked],
    abilities: {
      whenAttackHitsControllerHasPlayedActivatedAttackReaction: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "none",
            },
            target: {
              kind: "hero",
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
                // Shared with Red Alert: facts.combat.attackReactionPlayedOrActivated.
                type: "has-status",
                status: "attack-reaction-played-or-activated-this-chain-link",
              },
            ],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "create-token",
                token: "bloodrot-pox",
                creator: "effect-controller",
                controller: "opponent",
              },
            ],
          },
        },
      },
    },
  },
);
