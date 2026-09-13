import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/concealed-sedative.generated.ts";

/**
 * PEN081 Concealed Sedative — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack with {p} greater than its
 *   base hits you, destroy this and create an Inertia token under each
 *   opponent's control.
 *
 * Model notes (hand-authored; sibling of PEN079/PEN080):
 * - filter hasStatus power-greater-than-base already wired on attack objects.
 * - hit target:hero for "hits you".
 * - create-token controller:opponent (was each).
 */
export const concealedSedative = defineCard(
  fabCardIdentitiesByCanonicalId["QFf8JBQK6HBJ6Tqdzm9HJ"],
  {
    keywords: [cloaked],
    abilities: {
      whenAttackGreaterThanBaseHitsDestroyCreateInertia: {
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
                hasStatus: "power-greater-than-base",
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
                token: "inertia",
                controller: "opponent",
              },
            ],
          },
        },
      },
    },
  },
);
