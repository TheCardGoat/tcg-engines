import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/concealed-nerve-gas.generated.ts";

/**
 * PEN079 Concealed Nerve Gas — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack with go again hits you,
 *   destroy this and create a Frailty token under each opponent's control.
 *
 * Model notes (hand-authored):
 * - Gate: equipped-face-down (cloaked seat). Face-up trap is inert.
 * - Trigger: opponent's attack hits a hero (you), attack has go-again.
 * - Effect: destroy self then Frailty under opponent. Printed "each opponent"
 *   is sole opponent in 1v1 product — controller: "opponent" (was "each",
 *   which seats tokens under both heroes including the trap controller).
 */
export const concealedNerveGas = defineCard(
  fabCardIdentitiesByCanonicalId["zNKcJKn8rMnzTNrm6jrQM"],
  {
    keywords: [cloaked],
    abilities: {
      whenAttackGoAgainHitsDestroyCreateFrailtyToken: {
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
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                hasKeyword: "go-again",
              },
            },
            target: {
              kind: "hero",
            },
          },
          state: {
            type: "has-status",
            status: "equipped-face-down",
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
                token: "frailty",
                // 1v1: each opponent → sole opposing seat (not "each" all heroes).
                controller: "opponent",
              },
            ],
          },
        },
      },
    },
  },
);
