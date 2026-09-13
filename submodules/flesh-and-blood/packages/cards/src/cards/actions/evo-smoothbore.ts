import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-smoothbore.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

/**
 * EVO036 Evo Smoothbore (yellow) — Mechanologist Action Evo Arms d3.
 *
 * Printed:
 *   If you have a base arms equipped, transform it into this, then equip this.
 *   Once per Turn Instant - Destroy a card under this: Your next weapon attack
 *   this turn gets +1{p}.
 *   Blade Break
 *
 * Model notes (hand-authored; arms sibling of EVO035 Engine Room):
 * - Printed "base arms" requires Base+Arms; transform targets equipment-arms
 *   base (CR 8.5.36), not self / any Arms.
 * - "weapon attack" appliesTo must use types:["Weapon"] — Weapon is FAB_TYPES,
 *   not a subtype (subtypes:["Weapon"] never matches matchesFilter vocabulary).
 * - a2 destroy-under cost needs under-zone cards after a real transform (§7).
 */
export const evoSmoothbore = definePitchFamily(fabPitchFamilies["evo-smoothbore"], {
  keywords: [bladeBreak],
  abilities: () => ({
    ifHaveBaseArmsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Arms"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-arms"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Arms"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    oncePerTurnInstantDestroyUnderNextWeaponAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy",
        from: "under-this",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { yellow: evoSmoothboreYellow } = evoSmoothbore.cards;
