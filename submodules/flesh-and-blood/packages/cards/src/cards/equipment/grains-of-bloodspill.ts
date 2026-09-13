import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grains-of-bloodspill.generated.ts";

/**
 * HVY097 Grains of Bloodspill — Warrior Chest d2 Temper.
 *
 * Printed:
 *   Whenever a weapon attack you control hits, you may pay {r}. If you do,
 *   create a Vigor token.
 *   Temper
 *
 * Model notes (hand-authored):
 * - "weapon attack" filters the hitting object as type Weapon (FAB_TYPES),
 *   not subtypes — subtypes:["Weapon"] is unknown vocabulary and never
 *   matches (same class of bug as prior Weapon type-line filters).
 * - Optional pay {r} is the principal; create-token vigor is the "if you do"
 *   branch (empty pay events skip then).
 * - actor: controller scopes to your own weapon hits only.
 */
export const grainsOfBloodspill = defineCard(
  fabCardIdentitiesByCanonicalId["FhJWwcJKQjbQhHGRcNFTf"],
  {
    keywords: [temper],
    abilities: {
      wheneverWeaponAttackControlHitsMayPayIfDo: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          },
        },
      },
    },
  },
);
