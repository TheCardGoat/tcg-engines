import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/danger-digits.generated.ts";

/**
 * ARK005 Danger Digits — Assassin/Ninja Arms d0.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target dagger you control that isn't on
 *   the active chain link deals 1 damage to the defending hero. If damage is
 *   dealt this way, the dagger has hit. Destroy the dagger.
 *
 * Model notes (hand-authored):
 * - Prior filter was English residue (You/Control/That/Isn't subtypes) on
 *   combat-chain — zero legal targets. Remodel: on-stack target dagger in
 *   controller weapon zones (not combat-chain = not on the active chain link).
 * - deal-damage.source is the chosen dagger; engine binds it + stamps
 *   damage-dealt-this-way when amount > 0; "has hit" is set-status hit → hit
 *   event. Destroy the dagger is unconditional after.
 * - ENGINE also fixed moveForZoneEvent to resolve catalog `weapon` via
 *   zoneRef.seat (weapon1/2) so effect destroy of weapons actually moves.
 */
export const dangerDigits = defineCard(fabCardIdentitiesByCanonicalId["kDCzjqmjjMT9hdnJTfRJb"], {
  abilities: {
    attackReactionDestroyTargetDaggerControlIsnTActive: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "defending-hero",
            },
            source: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "damage-dealt-this-way",
              comparison: { op: "gt", value: 0 },
            },
            then: {
              type: "set-status",
              status: "hit",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
          {
            type: "destroy",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  },
});
